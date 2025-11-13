import React, { useState } from "react";
import { useForm } from "@formspree/react";
import {
  FaPhone,
  FaUser,
  FaEnvelope,
  FaShoppingBag,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

// Componente Modal de Pago
const PaymentModal = ({ isOpen, onClose, cart, total, currentUser }) => {
  const [phone, setPhone] = useState("+505 ");
  const [state, handleSubmit] = useForm("xgvrvarw");

  const isSubmitting = state.submitting;
  const isSuccess = state.succeeded;

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith("+505 ")) {
      setPhone("+505 ");
      return;
    }
    if (value.length <= 15) {
      setPhone(value);
    }
  };

  // Generar texto plano para el email (más compatible)
  const generateOrderSummary = () => {
    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} - $${item.price} x ${item.quantity} = $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    return `
NUEVO PEDIDO - GRACIASENMANO

INFORMACIÓN DEL CLIENTE:
Nombre: ${currentUser?.name || "Cliente"}
Email: ${currentUser?.email || "No especificado"}
Teléfono: ${phone}
Fecha: ${new Date().toLocaleDateString()}

DETALLES DEL PEDIDO:
${itemsText}

TOTAL: $${total}
Productos: ${cart.length}

¡Gracias por tu compra! ✨
    `.trim();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Crear un formulario simple que Formspree pueda procesar
    const form = e.target;

    // Agregar campos ocultos con la información
    const addHiddenField = (name, value) => {
      let input = form.querySelector(`[name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    };

    // Agregar todos los datos como campos ocultos
    addHiddenField("customer_name", currentUser?.name || "Cliente");
    addHiddenField("customer_email", currentUser?.email || "No especificado");
    addHiddenField("customer_phone", phone);
    addHiddenField("order_total", `$${total}`);
    addHiddenField("order_items_count", cart.length.toString());
    addHiddenField("order_summary", generateOrderSummary());

    // Agregar cada producto individualmente
    cart.forEach((item, index) => {
      addHiddenField(`product_${index}_name`, item.name);
      addHiddenField(`product_${index}_price`, `$${item.price}`);
      addHiddenField(`product_${index}_quantity`, item.quantity.toString());
      addHiddenField(
        `product_${index}_subtotal`,
        `$${(item.price * item.quantity).toFixed(2)}`
      );
    });

    // Usar el handleSubmit de Formspree
    await handleSubmit(e);

    if (state.succeeded) {
      setTimeout(() => {
        onClose();
        setPhone("+505 ");
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Finalizar Compra 🛒
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
            disabled={isSubmitting}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaperPlane className="text-green-400 text-2xl" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                ¡Pedido Enviado!
              </h4>
              <p className="text-gray-300 mb-4">
                Hemos recibido tu pedido exitosamente. Te contactaremos pronto
                al {phone}
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mt-4">
                <p className="text-green-400 font-semibold">
                  Revisa tu correo electrónico para más detalles
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Resumen del pedido */}
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-purple-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FaShoppingBag className="text-purple-400" />
                  Resumen de tu Pedido
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-purple-400 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-purple-500/20 mt-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-pink-400">
                      ${total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-purple-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Información de Contacto
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nombre:</span>
                    <span className="text-white">
                      {currentUser?.name || "No especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">
                      {currentUser?.email || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Campo principal que Formspree necesita (puede ser oculto) */}
                <input
                  type="hidden"
                  name="_subject"
                  value={`Nuevo Pedido - ${currentUser?.name || "Cliente"}`}
                />
                <input
                  type="hidden"
                  name="_replyto"
                  value={currentUser?.email || ""}
                />

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+505 "
                    required
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    pattern="\+505\s[0-9]{4}-?[0-9]{4}"
                    title="Formato: +505 XXXX-XXXX"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-blue-300 text-sm font-semibold">
                        Confirmación por Correo
                      </p>
                      <p className="text-gray-400 text-xs">
                        Te enviaremos los detalles de tu pedido al correo
                        electrónico registrado
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm" />
                      Confirmar y Enviar Pedido
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
