import axios from "axios";
import {
  PAYPAL_API,
  HOST,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config";
let user = {};
let project = {};
let costo = 0;
let mail = '';

export const createOrder = async (req, res) => {
  try {
    const { precio, email, usuario, proyecto } = {
      precio: req.body.precio,
      email: req.body.email,
      usuario: req.body.usuario, 
      proyecto: req.body.proyecto
    };

    user = usuario;
    project = proyecto
    costo = precio;
    mail = email;

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: precio,
          },
          payee: {
            email_address: email,
          },
          payment_instruction: {
            disbursement_mode: "INSTANT",
            platform_fees: [
              {
                amount: {
                  currency_code: "USD",
                  value: (10 * precio) / 100,
                },
              },
            ],
          },
        },
      ],
      application_context: {
        brand_name: "FeedArt",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        cancel_url: `${HOST}/cancel-payment`,
      },
    };

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token);

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const respuesta = {data: response.data, usuario, proyecto }

    console.log(response)

    return res.json(respuesta);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(response.data);

    // let params = "{details: {purchase_units: [{amount: {currency_code: 'USD',value: costo,},payee: {email_address: mail,},payment_instruction: {disbursement_mode: 'INSTANT',platform_fees: [{amount: {currency_code: 'USD',value: (10 * costo) / 100,},},],},shipping: {address: {"+
    // "address_line_1: 'response.data.purchase_units[0].shipping.address.address_line_1',"+
    // "admin_area_1: 'response.data.purchase_units[0].shipping.address.admin_area_1',"+
    // "country_code: response.data.payer.address.country_code,},name: {full_name: response.data.payer.name.given_name+' '+response.data.payer.name.surname    } }, },],},usuario: user.uid,proyecto: {id: project.id,datos: {descripcion: project.datos.descripcion,likes: project.datos.likes,titulo: project.datos.titulo,tags: project.datos.tags,comentarios: project.datos.comentarios,categoria: project.datos.categoria,favs: project.datos.favs,img_url: project.datos.img_url,precio: project.datos.precio,uid_creador: project.datos.uid_creador,fecha: project.datos.fecha,},},}"

    let params = {
      details: {
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: costo,
            },
            payee: {
              email_address: mail,
            },
            payment_instruction: {
              disbursement_mode: 'INSTANT',
              platform_fees: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: (5 * costo) / 100,
                  },
                },
              ],
            },
            shipping: {
              address: {
                address_line_1: response.data.purchase_units[0].shipping.address.address_line_1,
                admin_area_1: response.data.purchase_units[0].shipping.address.admin_area_1,
                country_code: response.data.payer.address.country_code,
              },
              name: {
                full_name: response.data.payer.name.given_name+' '+response.data.payer.name.surname
              }
            },
          },
        ],
      },
      usuario: user.uid,
      proyecto: {
        id: project.id,
        datos: {
          descripcion: project.datos.descripcion,
          likes: project.datos.likes,
          titulo: project.datos.titulo,
          tags: project.datos.tags,
          comentarios: project.datos.comentarios,
          categoria: project.datos.categoria,
          favs: project.datos.favs,
          img_url: project.datos.img_url,
          precio: project.datos.precio,
          uid_creador: project.datos.uid_creador,
          fecha: project.datos.fecha,
        },
      },
    };

    let cabecero = String(params)
    res.redirect(`http://localhost:3000/completo/${cabecero}`);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const cancelPayment = (req, res) => {
  res.redirect("http://localhost:3000/project/"+project.id);
  // res.redirect("https://feedart.netlify.app/");
  // res.redirect("/");
};
