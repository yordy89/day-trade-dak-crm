'use client';

import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { TradingBooksList } from '@/components/academy/books/TradingBooksList';

export default function TradingBooksPage(): React.JSX.Element {
  return (
    <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        📘 Biblioteca del Éxito: Finanzas, Trading y Superación
      </Typography>

      {/* ✅ Books with Different Formats (Hardcover, Kindle, Paperback) */}
      <TradingBooksList
        title="📚 Trading Paso a Paso"
        showFormatButtons
        books={[
          {
            title: 'Invertir con confianza: El arte de ganar en el mercado de Valores',
            author: 'Mijail Medina',
            image: '/assets/books/invertir-con-confianza.jpg',
            link: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish/dp/B0DZR1J9VX/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1',
            format: 'Tapa Dura',
          },
          {
            title: 'Invertir con confianza: El arte de ganar en el mercado de Valores',
            author: 'Mijail Medina',
            image: '/assets/books/invertir-con-confianza.jpg',
            link: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish/dp/B0DZRCLTMP/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1',
            format: 'Tapa Blanda',
          },
          {
            title: 'Invertir con confianza: El arte de ganar en el mercado de Valores',
            author: 'Mijail Medina',
            image: '/assets/books/invertir-con-confianza.jpg',
            link: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish-ebook/dp/B0DZRD4K7C/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1',
            format: 'Kindle',
          },
        ]}
      />
<Divider sx={{ my: 4 }} />
      {/* ✅ Essential Trading Books (Standard Button) */}
      <TradingBooksList
        title="📈 Libros que Transformarán tu Mentalidad y Finanzas"
        books={[
          {
            title: 'Los Magos del Mercado',
            author: 'Jack D. Schwager',
            image: '/assets/books/los-magos-del-mercado.jpg',
            link: 'https://www.amazon.com/Los-magos-del-mercado/dp/8494276840/ref=sr_1_1?crid=37ZIBW270ZP4V&dib=eyJ2IjoiMSJ9.a4O8Z-L39OOz-6k66okht-d-UM6lKnwiIDtsktxecYiwtdFnGZHnO6keME9HudZiQqMf8nE2q64C_2vbvZlfMgwy9zyTjh70OciUjla8pdgM_4rsWQsvOCBFlBWzoRowCZcnTCg9nOmM5HcO3adk6BVks3tBB1CWrzhnvVO-IU2Zv2zZ2TycP66V1ZjTyPzkQRHiRXwHJUnWZWV2PftNNrDk8YrR9kFlhMHQ_Nz8yhs.0cX9rx-TXmjreCIaOtepbXjeXKofPyd9SUKk8VGocmk&dib_tag=se&keywords=los+magos+del+mercado&qid=1741470914&sprefix=Los+magos%2Caps%2C143&sr=8-1',
          },
          {
            title: 'Piense y hágase rico',
            author: 'Napoleon Hill',
            image: '/assets/books/piense-y-hagase-rico.jpg',
            link: 'https://www.amazon.com/Piense-H%C3%A1gase-Rico-Traducci%C3%B3n-Collection/dp/1535598093/ref=sr_1_1?crid=1H2P6GWLMRNW4&dib=eyJ2IjoiMSJ9.xSSXoB4c_4iqJ7UtFfvSznsNeq0s7CcDD1ajSc0eRnZ8K9b-cPvQYcY-Ou0_kEE5XCjE_C3bSuwOenqdd0vEZLUJWkKzt70Ter44X_G8A8vNRYIAYiNKR7E8spF99cOPwnMr-2aNISFNaGqS7Tqi91NOsKEEa84lx_c2P1qEqOc1oHMWNHr7IaUNLx0vR0IaWQb86DOSP18E8pCAmPJ8_vIX3QBVQSIwdoG4h3ll200.Wdeer1WLKRE78cBHSvfsgtaJYwMqSr0oOrRdosP76Mg&dib_tag=se&keywords=piense+y+h%C3%A1gase+rico&qid=1741471018&sprefix=Piense+%2Caps%2C135&sr=8-1',
          },
          {
            title: 'El Millonario instantáneo',
            author: 'Mark Fisher',
            image: '/assets/books/el-millonario-instantaneo.jpg',
            link: 'https://www.amazon.com/millonario-instantaneo-Spanish-Mark-Fisher/dp/8495787083/ref=sr_1_1?crid=PPM1U60TBEUS&dib=eyJ2IjoiMSJ9.2Yv42NRUOYLrRhDRgn82KnjfKoAMYo0Q0Xgolk50ApmcK1eufiVfI_5r7F9g4aDQ.15kIAUzLxA25TfXhjS45KCktbXxd8FT86jNoCSt3p2U&dib_tag=se&keywords=el+millonario+instantaneo+libro&qid=1741471106&sprefix=El+millonario%2Caps%2C115&sr=8-1',
          },
          {
            title: 'Solo una cosa',
            author: 'Gary Keller',
            image: '/assets/books/solo-una-cosa.jpg',
            link: 'https://www.amazon.com/Solo-una-cosa-Thing-Spanish/dp/6071136962/ref=sr_1_1?crid=288MKM7X0CYQO&dib=eyJ2IjoiMSJ9.PlBCuhojOa8scnc2ypgobPe2m-2u7mKZpvx1XZ8nhobDz-IrW521wCcWC4uhrlGiWiB-BnMHIaxaUjNN3c3_54mroJBavSU5VIOjnDi28RQ.4D0iWKJQJWR4ZzfHufC-vpQVIw6zMCWOsMEnEAcYSm8&dib_tag=se&keywords=solo+una+cosa+libro+espa%C3%B1ol&qid=1741471215&sprefix=Solo+una+cosa%2Caps%2C120&sr=8-1',
          },
          {
            title: 'El Monje que vendió su Ferrari',
            author: 'Robin Sharma',
            image: '/assets/books/el-monje-que-vendio-su-ferrari.jpg',
            link: 'https://www.amazon.com/vendi%C3%B3-Ferrari-edici%C3%B3n-limitada-Spanish/dp/8466376194/ref=sr_1_2?crid=1LW4PWGKL8259&dib=eyJ2IjoiMSJ9.pVosyTZtUgOqT_P4W7lKKgW3K82JVck0j-Va1UIY3QuQzrsnwEe2v1N4i0-J3mFaEwyCGyRs55oXrBhg9wwGCXpMUTOuZ28XfKTH6ApK0yFv1YM-WDB-K5beQGIst_yiq60MiLbt6w12RHeyQAiGmsYEILSF9Ah7pe0I3Pgj2io5YJuc9sOeYpVKLom60tPRpDtWNf9n8C6f2ZOU4D8C8Oxu2vSm-nR5G0Ac836eWik.FXiXul9rmKsHJbHFijpziOojczel0_ZJwXGC9xRl6Mk&dib_tag=se&keywords=el+monje+que+vendio+su+ferrari&qid=1741471291&sprefix=El+monje%2Caps%2C125&sr=8-2',
          },
          {
            title: 'Los cuatro acuerdos',
            author: 'Don Miguel Ruiz',
            image: '/assets/books/los-cuatro-acuerdos.jpg',
            link: 'https://www.amazon.com/Los-cuatro-acuerdos-audiolibro/dp/B07PGXC1L1/ref=sr_1_2?crid=DXXOL97X70UV&dib=eyJ2IjoiMSJ9.iiyUxoHi0yfFYVcqzoTVsCeeY3vOsK8sCofQ7ODSdIp-cBBUyee3M7zFGj91E_9Y_whu2ULUBaRYgAlvR0abvw8yVDzuxOzUt5N4_erJwS04A82pYXz4BZqQYK3W0jXR33Jqzc3AQplNZqHOufl6aYP1qeKG6-85XitzqziMVaLLhKvOt3GwaECZ2kLU383HHNMUEzwY78rJBuW2Y0ofXL6RF30unCE-sdJsG1cgyT8.PIgP3AUCImYLY8BuMUgk71cAJtaEPZwEvD6zhCTbxxE&dib_tag=se&keywords=los+cuatro+acuerdos&qid=1741471371&sprefix=los+cuatro+acuerdos%2Caps%2C119&sr=8-2',
          },
        ]}
      />
    </Box>
  );
}
