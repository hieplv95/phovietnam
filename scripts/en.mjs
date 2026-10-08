// English version of the home page (/en/), built from the Spanish one so it
// keeps the exact same design. Targets searches like "Vietnamese restaurant in
// Barcelona". Strings are matched on their trimmed, whitespace-collapsed text.

const TEXT = {
  // Header, side menu, footer
  "Reserva Mesa": "Book a Table",
  "Reservar": "Book a Table",
  "Close": "Close",
  "Dirección": "Address",
  "Contacto": "Contact",
  "HORARIO": "Opening Hours",
  "Lunes a Domingo: 12:00 a 16:30 – 18:30 a 22:30.": "Monday to Sunday: 12:00–16:30 and 18:30–22:30.",
  "Social": "Social",
  "Boletín informativo": "Newsletter",
  "Sign Me Up": "Sign Me Up",
  "El Horario": "Opening Hours",
  "Lunes - Domingo": "Monday - Sunday",
  "Miércoles": "Wednesday",
  "Cerrado": "Closed",
  "Nuestra ubicación": "Our Location",

  // Hero and intro
  "Restaurante vietnamita en Barcelona": "Vietnamese restaurant in Barcelona",
  "Cocina vietnamita auténtica.": "Authentic Vietnamese cuisine.",
  "Más de 30 especialidades.": "Over 30 specialities.",
  "¡Bienvenidos a PHO VIETNAM": "Welcome to PHO VIETNAM!",
  "En el corazón de Barcelona, te invitamos a descubrir los auténticos sabores de Vietnam. Nuestro restaurante es un rincón acogedor donde la tradición y el amor por la cocina vietnamita se encuentran en cada plato.":
    "In the heart of Barcelona, we invite you to discover the authentic flavours of Vietnam. Our Vietnamese restaurant is a cosy corner where tradition and a love for Vietnamese cooking come together in every dish.",
  "VER LAS CARTAS": "SEE THE MENU",
  "Reservar mesa Pho Vietnam Muntaner": "Book a table at Pho Vietnam Muntaner",
  "Reserva Pho Vietnam Maria Claret": "Book a table at Pho Vietnam Maria Claret",

  // Drinks & desserts
  "BEBIDAS Y POSTRES": "DRINKS & DESSERTS",
  "Café Vietnamita": "Vietnamese Coffee",
  "Té de melocotón": "Peach Tea",
  "La bebida etérea de la antigua capital": "The ethereal drink of the ancient capital",
  "Té de lichi": "Lychee Tea",

  // Menu
  "LAS CARTAS": "OUR MENU",
  "Las Cartas Completas": "Full Menu",
  "Platos típicos": "Signature dishes",
  "Fideos de arroz con rico caldo de hueso, ternera, limoncillo, lechuga, cebolla frita":
    "Rice noodles in a rich bone broth with beef, lemongrass, lettuce and fried onion",
  "Fideo de arroz, carne de cerdo a la parrilla, limoncillo, zanahoria, lechuga, hierbas, pepinos, cacahuetes, cebolla frita":
    "Rice noodles with grilled pork, lemongrass, carrot, lettuce, herbs, cucumber, peanuts and fried onion",
  "Fideos pho tradicionales con rico caldo de hueso, solomillo de ternera en rodajas finas":
    "Traditional pho noodles in a rich bone broth with thinly sliced beef sirloin",
  "Tallarines salteados con ternera al salsa de ostras, cebolla, verduras":
    "Stir-fried noodles with beef in oyster sauce, onion and vegetables",
  "Rollitos de verano con papel de arroz, lechuga, zanahoria, pepino, hierbas. Junto con salsa de cacahuetes":
    "Rice paper summer rolls with lettuce, carrot, cucumber and herbs, served with peanut sauce",
  "Papel de arroz, cebolla, cebolla verde, zanahoria, huevos, brotes de soja, setas oreja de madera.":
    "Rice paper, onion, spring onion, carrot, egg, bean sprouts and wood ear mushrooms.",
  "Ternera salteada con pimientos, ajo, verduras, tomate. Junto con arroz":
    "Stir-fried beef with peppers, garlic, vegetables and tomato, served with rice",
  "BUN CHA es un plato tradicional famoso de Hanói, muy apreciado tanto por los comensales locales como por los extranjeros":
    "BUN CHA is a famous traditional dish from Hanoi, loved by locals and visitors alike",

  // Signature dishes
  "Platos Tradicionales Vietnamitas": "Traditional Vietnamese Dishes",
  "Los Platos Característicos": "The Restaurant's",
  "Del Restaurante": "Signature Dishes",

  // About
  "PHO VIETNAM & COFFEE CHILL": "PHO VIETNAM & COFFEE CHILL",
  "Gastronomía vietnamita aquí mismo en Barcelona.": "Vietnamese food right here in Barcelona.",
  "Bienvenidos al restaurante PHO VIETNAM. Vengan a nuestro restaurante para descubrir platos tradicionales llenos de sabor o las famosas comidas callejeras de Vietnam.":
    "Welcome to PHO VIETNAM. Come to our restaurant to discover traditional dishes full of flavour and Vietnam's famous street food.",

  // Specials
  "Bienvenidos a PHO VIETNAM": "Welcome to PHO VIETNAM",
  "Nuestros platos": "Our special",
  "especiales": "dishes",
  "Plato Especial #1": "Special Dish #1",
  "Plato Especial #2": "Special Dish #2",
  "Plato Especial #3": "Special Dish #3",
  "Un Plato": "One Dish",
  "Phở es un plato tradicional famoso de Vietnam, que consiste en un caldo claro, fideos de arroz suaves y carne (generalmente de res o pollo), acompañado de hierbas aromáticas y condimentos. Tiene un sabor característico e intenso":
    "Phở is Vietnam's most famous traditional dish: a clear broth with soft rice noodles and meat (usually beef or chicken), served with aromatic herbs and condiments. Its flavour is distinctive and intense",
  'es un plato sabroso que combina la cocina vietnamita con influencias occidentales. Consiste en cubos de carne de res salteados a fuego alto con cebolla, pimientos y condimentos aromáticos. El nombre "luc lac" proviene del movimiento de los trozos de carne al ser agitados en la sartén. Se sirve comúnmente con arroz blanco, huevo frito y ensalada, formando una comida completa, colorida y llena de sabor.':
    'is a tasty dish that blends Vietnamese cooking with Western influences: cubes of beef seared over high heat with onion, peppers and aromatic seasonings. The name "luc lac" comes from the shaking of the beef in the pan. It is usually served with white rice, a fried egg and salad for a complete, colourful and flavourful meal.',
  "Banh Cuon es un plato tradicional de Vietnam, perteneciente a la categoría de los pasteles hechos con harina de arroz al vapor. Es especialmente popular en el norte del país, sobre todo en Hanói.":
    "Banh Cuon is a traditional Vietnamese dish of steamed rice-flour rolls. It is especially popular in the north of the country, above all in Hanoi.",

  // Call to action
  "¿A qué esperas?": "What are you waiting for?",
  "Ven con tus amigos y familiares": "Come with your friends and family",
  "A disfrutar de los platos más famosos de nuestro país, en un rincón de la gastronomía vietnamita justo en el corazón de Barcelona.":
    "Enjoy the most famous dishes of our country in a corner of Vietnamese cuisine right in the heart of Barcelona.",

  // Cookie banner (Complianz)
  "Gestionar consentimiento": "Manage consent",
  "Para ofrecer las mejores experiencias, utilizamos tecnologías como las cookies para almacenar y/o acceder a la información del dispositivo. El consentimiento de estas tecnologías nos permitirá procesar datos como el comportamiento de navegación o las identificaciones únicas en este sitio. No consentir o retirar el consentimiento, puede afectar negativamente a ciertas características y funciones.":
    "To provide the best experiences, we use technologies like cookies to store and/or access device information. Consenting to these technologies will allow us to process data such as browsing behaviour or unique IDs on this site. Not consenting or withdrawing consent may adversely affect certain features and functions.",
  "Funcional": "Functional",
  "Siempre activo": "Always active",
  "El almacenamiento o acceso técnico es estrictamente necesario para el propósito legítimo de permitir el uso de un servicio específico explícitamente solicitado por el abonado o usuario, o con el único propósito de llevar a cabo la transmisión de una comunicación a través de una red de comunicaciones electrónicas.":
    "The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network.",
  "Estadísticas": "Statistics",
  "El almacenamiento o acceso técnico que se utiliza exclusivamente con fines estadísticos anónimos. Sin un requerimiento, el cumplimiento voluntario por parte de tu proveedor de servicios de Internet, o los registros adicionales de un tercero, la información almacenada o recuperada sólo para este propósito no se puede utilizar para identificarte.":
    "The technical storage or access that is used exclusively for anonymous statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service Provider, or additional records from a third party, information stored or retrieved for this purpose alone cannot usually be used to identify you.",
  "El almacenamiento o acceso técnico es necesario para crear perfiles de usuario para enviar publicidad, o para rastrear al usuario en una web o en varias web con fines de marketing similares.":
    "The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes.",
  "Administrar opciones": "Manage options",
  "Gestionar los servicios": "Manage services",
  "Gestionar {vendor_count} proveedores": "Manage {vendor_count} vendors",
  "Leer más sobre estos propósitos": "Read more about these purposes",
  "Aceptar": "Accept",
  "Denegar": "Deny",
  "Ver preferencias": "View preferences",
  "Guardar preferencias": "Save preferences",
  "Política de cookies": "Cookie Policy",
  "Declaración de Privacidad": "Privacy Statement",
};

const ATTRS = {
  "Cerrar ventana": "Close window",
  "Lee más acerca de los fines de TCF en la base de datos de cookies": "Read more about TCF purposes in the cookie database",
};

const norm = (s) => s.replace(/\s+/g, " ").trim();

export function translateToEnglish($) {
  $("html").attr("lang", "en");
  $("body *")
    .contents()
    .each((_, node) => {
      if (node.type !== "text" || ["script", "style"].includes(node.parent?.tagName)) return;
      const key = norm(node.data);
      if (!key || !(key in TEXT)) return;
      const lead = node.data.match(/^\s*/)[0];
      const trail = node.data.match(/\s*$/)[0];
      node.data = lead + TEXT[key] + trail;
    });
  $("[aria-label], [title]").each((_, el) => {
    for (const attr of ["aria-label", "title"]) {
      const v = $(el).attr(attr);
      if (v && ATTRS[v]) $(el).attr(attr, ATTRS[v]);
    }
  });
  // The cookie banner script builds some labels from its own config.
  $("script#cmplz-cookiebanner-js-extra").each((_, el) => {
    const js = ($(el).html() || "")
      .replace(/Pol\\u00edtica de cookies/g, "Cookie Policy")
      .replace(/Declaraci\\u00f3n de Privacidad/g, "Privacy Statement")
      .replace(/m\\u00e1rketing/g, "marketing")
      .replace(/estad\\u00edsticas/g, "statistics");
    $(el).text(js);
  });

  // The theme's "translate this page" widget assumes Spanish source text.
  $(".gtranslate_wrapper, script[id^='gt_widget_script']").remove();
  $("script[src*='/gtranslate/']").remove();
}
