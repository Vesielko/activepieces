import { useMutation } from '@tanstack/react-query';
import { HttpStatusCode, isAxiosError } from 'axios';
import { t } from 'i18next';
import JSZip from 'jszip';
import { TriangleAlert } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { useTelemetry } from '@/components/telemetry-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { authenticationSession } from '@/lib/authentication-session';
import {
  FlowOperationType,
  FlowTemplate,
  PopulatedFlow,
  TelemetryEventName,
} from '@activepieces/shared';

import { FormError } from '../../../components/ui/form';
import { flowsApi } from '../lib/flows-api';

export type ImportFlowDialogProps =
  | {
      insideBuilder: false;
      onRefresh: () => void;
    }
  | {
      insideBuilder: true;
      flowId: string;
      onRefresh: () => void;
    };

const readTemplateJson = (
  templateFile: File,
  addTemplate: (template: FlowTemplate) => void,
  setFailedFiles: (failedFiles: string[]) => void,
) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const template = JSON.parse(reader.result as string);
      if (!template.template || !template.name || !template.template.trigger) {
        setFailedFiles((prevFailedFiles) => [
          ...prevFailedFiles,
          templateFile.name,
        ]);
      } else {
        addTemplate(template as FlowTemplate);
      }
    } catch (error) {
      setFailedFiles((prevFailedFiles) => [
        ...prevFailedFiles,
        templateFile.name,
      ]);
    }
  };
  reader.readAsText(templateFile);
};

const ImportFlowDialog = (
  props: ImportFlowDialogProps & { children: React.ReactNode },
) => {
  const { capture } = useTelemetry();
  const [templates, setTemplates] = useState<FlowTemplate[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);

  const { mutate: importFlow, isPending } = useMutation<
    PopulatedFlow,
    Error,
    FlowTemplate
  >({
    mutationFn: async (template: FlowTemplate) => {
      const flow = props.insideBuilder
        ? await flowsApi.get(props.flowId)
        : await flowsApi.create({
            displayName: template.name,
            projectId: authenticationSession.getProjectId()!,
          });

      return await flowsApi.update(flow.id, {
        type: FlowOperationType.IMPORT_FLOW,
        request: {
          displayName: template.name,
          trigger: template.template.trigger,
          schemaVersion: template.template.schemaVersion,
        },
      });
    },
    onSuccess: (flow) => {
      capture({
        name: TelemetryEventName.FLOW_IMPORTED_USING_FILE,
        payload: {
          location: props.insideBuilder
            ? 'inside the builder'
            : 'inside dashboard',
        },
      });

      if (failedFiles.length) {
        toast({
          title: t('Import Warning'),
          description:
            t('The following files failed to import: ') +
            failedFiles.join(', '),
        });
      } else {
        toast({
          title: t('Import Success'),
          description: t(
            `Flow${templates.length === 1 ? '' : 's'} imported successfully.`,
          ),
          variant: 'default',
        });
      }

      setIsDialogOpen(false);
      props.onRefresh();
    },
    onError: (err) => {
      if (
        isAxiosError(err) &&
        err.response?.status === HttpStatusCode.BadRequest
      ) {
        setErrorMessage(t('Template file is invalid'));
        console.log(err);
      } else {
        toast(INTERNAL_ERROR_TOAST);
      }
    },
  });

  const handleSubmit = async () => {
    if (templates.length === 0) {
      if (failedFiles.length) {
        toast({
          title: t('Import Warning'),
          description:
            t('The following files failed to import: ') +
            failedFiles.join(', '),
        });
      } else {
        setErrorMessage(t('Please select a file first'));
      }
    } else {
      setErrorMessage('');
      templates.forEach((template) => importFlow(template));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.[0]) return;

    setTemplates([]);
    setFailedFiles([]);
    setErrorMessage('');
    const file = files[0];
    const newTemplates: FlowTemplate[] = [];

    if (file.type === 'application/zip') {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const jsonFiles = Object.keys(zipContent.files).filter((fileName) =>
        fileName.endsWith('.json'),
      );

      for (const fileName of jsonFiles) {
        const fileData = await zipContent.files[fileName].async('string');
        readTemplateJson(
          new File([fileData], fileName),
          (template) => {
            if (template) newTemplates.push(template);
          },
          setFailedFiles,
        );
      }
    } else if (file.type === 'application/json') {
      readTemplateJson(
        file,
        (template) => {
          if (template) newTemplates.push(template);
        },
        setFailedFiles,
      );
    } else {
      setErrorMessage(t('Unsupported file type'));
      return;
    }

    setTemplates(newTemplates);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setErrorMessage('');
          setTemplates([]);
          setFailedFiles([]);
        }
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex flex-col gap-3">
            <DialogTitle>{t('Import Flow')}</DialogTitle>
            {props.insideBuilder && (
              <div className="flex gap-1 items-center text-muted-foreground">
                <TriangleAlert className="w-5 h-5 stroke-warning"></TriangleAlert>
                <div className="font-semibold">{t('Warning')}:</div>
                <div>
                  {t('Importing a flow will overwrite your current one.')}
                </div>
              </div>
            )}
          </div>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Input
            type="file"
            accept=".json,.zip"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button onClick={handleSubmit} loading={isPending}>
            {t('Import')}
          </Button>
        </div>
        {errorMessage && (
          <FormError formMessageId="import-flow-error-message" className="mt-4">
            {errorMessage}
          </FormError>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ImportFlowDialog };
