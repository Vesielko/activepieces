import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import {
  getSubscriberById,
  getSubscriberByEmail,
  listSubscribers,
  updateSubscriber,
  unsubscribeSubscriber,
  listSubscriberTagsByEmail,
  listTagsBySubscriberId,
} from './lib/actions/subscribers';
import {
  listFields,
  createField,
  updateField,
  deleteField,
} from './lib/actions/custom-fields';

import { createWebhook, deleteWebhook } from './lib/actions/webhooks';

import {
  listBroadcasts,
  createBroadcast,
  getBroadcastById,
  updateBroadcast,
  deleteBroadcast,
  broadcastStats,
} from './lib/actions/broadcasts';

import {
  listForms,
  addSubscriberToForm,
  listFormSubscriptions,
} from './lib/actions/forms';

import {
  listSequences,
  addSubscriberToSequence,
  listSupscriptionsToSequence,
} from './lib/actions/sequences';

import {
  listTags,
  createTag,
  tagSubscriber,
  removeTagFromSubscriberByEmail,
  removeTagFromSubscriberById,
  listSubscriptionsToATag,
} from './lib/actions/tags';

import {
  listPurchases,
  getPurchaseById,
  createSinglePurchase,
  createPurchases,
} from './lib/actions/purchases';

import {
  addTag,
  removeTag,
  subscriberActivated,
  subscriberUnsubscribed,
  subscriberBounced,
  subscriberComplained,
  formSubscribed,
  courseSubscribed,
  courseCompleted,
  linkClicked,
  productPurchased,
  purchaseCreated,
} from './lib/triggers/triggers';

export const convertkitAuth = PieceAuth.SecretText({
  displayName: 'API Secret',
  description: 'Enter your API Secret key',
  required: true,
});

export const convertkit = createPiece({
  displayName: 'ConvertKit',
  auth: convertkitAuth,
  minimumSupportedRelease: '0.2.0',
  logoUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALVBMVEVHcEz8aXD8aXD8aHD7aXD8aXH7aXD7aXD7aXD7aXD8aXD7aXD7aXD7aXD7aXBzHgIEAAAADnRSTlMAvg1DpSJt1eJZ74CQMs9LoKAAAADYSURBVDiNlVNLFsQgCBO1/sv9jzvPURDUWUx2EAokRWP+gg1QEDF5d6c9LoSTD6iQ7MY33PEqvh68rnAXHlEUcM5nF4CCeCzYRvhSBcstmzZbdItntl8jZwYfNUGqmqZVGYGyFWUOZLVaK40g6ZXFR31sjdk8HeZeYA/XB+KXL8NjfykgI+AQOODImpuANQEzmbxfR+b/Oe8kaZ6cBl5G28jX0aXzKWai1/F66UiPQ3a5Ro5JnMho8OZw54X358nv7+JNO39Y59QmbTfuqy5A71Og3Z/uD3wAxuQY2rMDSakAAAAASUVORK5CYII=',
  authors: [],
  actions: [
    getSubscriberById,
    getSubscriberByEmail,
    listSubscribers,
    updateSubscriber,
    unsubscribeSubscriber,
    listSubscriberTagsByEmail,
    listTagsBySubscriberId,
    createWebhook,
    deleteWebhook,
    listFields,
    createField,
    updateField,
    deleteField,
    listBroadcasts,
    createBroadcast,
    getBroadcastById,
    updateBroadcast,
    deleteBroadcast,
    broadcastStats,
    listForms,
    addSubscriberToForm,
    listFormSubscriptions,
    listSequences,
    addSubscriberToSequence,
    listSupscriptionsToSequence,
    listTags,
    createTag,
    tagSubscriber,
    removeTagFromSubscriberByEmail,
    removeTagFromSubscriberById,
    listSubscriptionsToATag,
    listPurchases,
    getPurchaseById,
    createSinglePurchase,
    createPurchases,
  ],
  triggers: [
    addTag,
    removeTag,
    subscriberActivated,
    subscriberUnsubscribed,
    subscriberBounced,
    subscriberComplained,
    formSubscribed,
    courseSubscribed,
    courseCompleted,
    linkClicked,
    productPurchased,
    purchaseCreated,
  ],
});
