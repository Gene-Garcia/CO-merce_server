// models
const Order = require("mongoose").model("Order");

// constants
const { error } = require("../config/errorMessages");
const { orderStatus } = require("../config/status");

/*
 * GET Method
 *
 */
exports.getUserToRateProduct = async (req, res, next) => {
  const userId = req.user._id;

  try {
    // get user's order that has a status of Review
    // populate orderedProducts that has rate === true
    // get those products
    let orders = await Order.find(
      {
        _customer: userId,
        status: orderStatus[2],
      },
      "status orderDate ETADate orderedProducts.rated orderedProducts._product"
    ).populate({
      path: "orderedProducts._product",
      select: "item imageAddress retailPrice",
    });

    // flattens the data into client-ready object
    // orderId and dates of the order are redundantly stored in each products
    // so that client can easily access the order information of each product
    let products = [];
    orders.forEach((e) => {
      const base = {
        orderId: e._id,
        orderDate: e.orderDate,
        ETADate: e.ETADate,
      };

      e.orderedProducts.forEach(({ _product: f, rated }) => {
        if (!rated)
          products.push({
            ...base,
            productId: f._id,
            item: f.item,
            imageAddress: f.imageAddress,
            retailPrice: f.retailPrice,
          });
      });
    });

    res.status(200).json({ products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: error.serverError });
  }
};
