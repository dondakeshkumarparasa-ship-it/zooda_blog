const express = require('express');
const authRouter = require('../modules/auth/auth.routes');
const userRouter = require('../modules/users/user.routes');
const clientRouter = require('../modules/clients/client.routes');
const productRouter = require('../modules/products/product.routes');
const promotionRouter = require('../modules/promotions/promotion.routes');
const analyticsRouter = require('../modules/analytics/analytics.routes');
const chatRouter = require('../modules/chats/chat.routes');
const adminRouter = require('../modules/admins/admin.routes');
const categoryRouter = require('../modules/categories/category.routes');
const orderRouter = require('../modules/orders/order.routes');
const paymentRouter = require('../modules/payments/payment.routes');
const notificationRouter = require('../modules/notifications/notification.routes');
const reportRouter = require('../modules/reports/report.routes');
const pageRouter = require('../modules/pages/page.routes');

const apiRouter = express.Router();

apiRouter.use(authRouter);
apiRouter.use(userRouter);
apiRouter.use(clientRouter);
apiRouter.use(productRouter);
apiRouter.use(promotionRouter);
apiRouter.use(analyticsRouter);
apiRouter.use(chatRouter);
apiRouter.use(adminRouter);
apiRouter.use(categoryRouter);
apiRouter.use(orderRouter);
apiRouter.use(paymentRouter);
apiRouter.use(notificationRouter);
apiRouter.use(reportRouter);
apiRouter.use(pageRouter);

module.exports = {
  apiRouter
};
