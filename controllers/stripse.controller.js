const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckOutSession = async (req, res) => {
    const cartItems = req.body.cart;
    const products = cartItems.map((item) => {
        return {
            productID: item.productID,
            quantity: item.quantity,
        }
    });
    const customer = await stripe.customer.create({
        metadata: {
            email:req.body.email.toString(),
            cart: JSON.stringify(products),
        }
    });

    const line_items = cartItems.map((item) => {
        return {
            price_data:{
                currency: "thb",
                product_data:{
                    name: item.name,
                    images: [item.images],
                    description: item.name,
                    metadata: {
                        id: item.productId,
                    },
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }
    });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "promptpay"], //payment method
    shipping_address_collection: {
      allowed_counties: ["TH"],
    },
    shipping_option: [
      {
        shipping_rate_data: {
          type: "flex_amount",
          fixed_amount: {
            amount: 0,
            currency: "THB",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            minimum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
        shipping_rate_data: {
          type: "flex_amount",
          fixed_amount: {
            amount: 4500,
            currency: "THB",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection:{
        enabled: true,
    },
    line_items,
    customer: customer.id,
    mode: "payment",
    success_url: `${process.env.BASE_URL}?success=true`,
    cancel_url: `${process.env.BASE_URL}?canceled=true`,
  });

  res.send({})
};
