const Order = require('../models/Order');

/**
 * Check and update order statuses from pending to delivered
 * if estimated arrival date has passed
 * This runs for ALL users and ALL orders
 */
const updateOrderStatuses = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all pending orders where estimated arrival date has passed
    const pendingOrders = await Order.find({
      orderStatus: 'pending',
      estimatedArrivalDate: { $lte: today }
    });

    if (pendingOrders.length > 0) {
      console.log(`Updating ${pendingOrders.length} order(s) from pending to delivered`);

      // Update all matching orders
      const updateResult = await Order.updateMany(
        {
          orderStatus: 'pending',
          estimatedArrivalDate: { $lte: today }
        },
        {
          $set: {
            orderStatus: 'delivered',
            deliveredAt: Date.now()
          }
        }
      );

      console.log(`Successfully updated ${updateResult.modifiedCount} order(s) to delivered status`);
      return updateResult.modifiedCount;
    }

    return 0;
  } catch (error) {
    console.error('Error updating order statuses:', error);
    return 0;
  }
};

module.exports = { updateOrderStatuses };


