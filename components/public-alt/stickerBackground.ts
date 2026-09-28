// Pola dekoratif "stiker" yang ditata tidak beraturan (posisi & rotasi acak)
// dalam satu ubin (tile) SVG 360x360px. Ubin ini di-repeat sebagai CSS
// background, jadi otomatis "melanjutkan diri" selama tinggi halaman
// bertambah — tidak perlu tahu panjang halaman sebelumnya, CSS
// background-repeat yang urus.
//
// Isi ubin ini dua sumber:
// 1. Enam karakter piksel dipotong satu-per-satu dari sprite sheet yang
//    diunggah pengguna (lihat lib/dummy-data untuk sprite aslinya), latar
//    ungu dihapus lewat color-key, lalu opacity tiap karakter diturunkan
//    langsung di data piksel PNG-nya (bukan lewat CSS opacity) supaya
//    tetap tajam saat elemen lain di atasnya di-hover/berubah.
// 2. Dua ikon asli dari pixelarticons.com (lisensi MIT, gratis): "book-open"
//    dan "hourglass" — path SVG-nya dipakai apa adanya, hanya diberi warna
//    putih transparan supaya senada dengan sisa pola.
//
// Ukuran tiap elemen dibesarkan (v2) dibanding revisi pertama supaya lebih
// mudah dikenali; tile ikut dilebarkan ke 360px agar tidak ada yang
// terpotong di tepi ubin. Opacity tetap sengaja sangat rendah (di bawah
// 16%) supaya jadi tekstur latar, bukan elemen yang bersaing dengan
// konten di atasnya.
const STICKER_TILE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360">
  <g>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAABACAYAAAAJQRcYAAAD1ElEQVR42tVYTUgbURD+oitCMUggNARKYK3SVwKBQKElBwPrD16C2HMwF29eCt4KBSGHngSheOslITehIl6ksRZzsAgtghBY22LESwgVU1nsxdj2sL7N283b7NvVxnQu7sZkvjcz33wzuz4losDJYtkUWUhOmT7LjM6r7H2utEIAYGlnEwBw8GpD5fmSRMGWdjahJAIAgO3dOnKlFUJBc6UVQoHowZayIDzQHnTYHCNcSE5h/3JPyJmSCICNNIMN94A0hTSd1PYv9yDPpgi9VhIB7vc8AQLAeq4O/4h+rX0DkACmM4GWCLd36wCAeJLvxyfCUkqK1KdDAMDhsYbzl88QDft1531PW35jZXH3koaeVp5NkcNjzfjs+/sG0nOtkS2+3bydGg5PSviCJ8b9dKbJyJCsu6lVGqjk+Q3vGhAAFuf0pi6cbKFc1Qw1mSjMkHbq4hnQ2o+F9QwBgM8Df/TUr2dIejrXFrQ7SQMAxfSaiuvU1SoNLCSncHX9v/j136sAAORwaxEW02tqMb2mhmTJlN6z1TzOVvNCPoQanxolB42SyhhtfLtmd53SicIMiYb9KFf1PtQVRjPul9POQHdGGseU0km+f7lnpI69pvfLY3n1RoC0XtGwnyvOrIQNT0pNJntJKUsOXsOzIIauRsa99WEsmyJ07ABAuaoZY4gCx/ue6gBz7Q/VFaRpAQzJkkF3WsNyVTNFYI1GNLqWlMayKdLss2ZKRYTcU4RKImACs1q5qnEPYHco2whpZKzRvqKMdXIqCno348kqwk714UUTDftR9Boh3S3dmlUwhKeF025iJRY7RYpeAEWBePbiwyxhSdd9SuPF2OFsjdQ1YK3SQK3SgMj3rKB0lrqqYUiWGFCt7ffYzY6OKxY0MzqvSizL4pEmvdlhGpIlIcIU2SFcAElHxlE42TKBd5w0vfKgjIfPHwcB4OreD4R7HyA2OISjod5gSHkUvPj5GwOBHtz39zs6+zUSCdY+fj0FgKN36unFWH+QRnlwfoTY4JC5huWqBoT1BYl9InKqH5v61m0dphqalqh20iRSw3YN33ZrY8eVKGGsOmwnj93x9ER7j9aQVz87AbfWUbjx2R/ynNvNRLYnbzwt3BJIqIaxbIqIaKfIS8HuJI1ZrKlpjim11tSOPJIbwlCndiuh9SDFTqwYrlNaqzRcq0vHVwzPEVIq89RFJGKRdV8SJYvos4OT2kidIgu3hqIb2v9LmnYroWhanWrtUyKKwU4nhXErEtu79ZbJL9npHvtE5JU0PL++16U35F8ytVzVTG+ouveNsJc68uwvr0DQILZLASwAAAAASUVORK5CYII=" width="28" height="64" transform="translate(20,12) rotate(-8)" style="image-rendering:pixelated"/>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA4CAYAAAC/pKvXAAAFR0lEQVR42u2aX0hbVxzHv7oonWJ303sXSA1LWjWeOvZQcEUYjNHtwVGGKy2bG4PRDYag4PbgwJdtPhXWB5E2WxC6Uvo2Nrohg/jah1qoD/NFrwnam1IbSBNNo7bBP2EP2+/25OT+i9MktR4I3j85N+dzvr/f9/y51px+7TQqXfz1dYw/j29sqqU+w1UNEGLDja5VDOTCUA8DgGuX/lSdQJAqXllCIp1Bl/dVXaVEOmOrUq3Thl2/FWLXb4VYKRAAcOZcJztzrpPZqeKVJXhlyfC+V5aKwm9HIDzAyPggcwoBAJ7jzfAcb7Z8PqlAnzdbFQCAz+3S/5pBlqxItZeXjr1yzLEaACApMtxKnfL37fmUmRrJxSWsr6yi0X1Yv3fyLVZU5/F2PuWvr2NrT3P6NVIjm8vj8Mu1yObyyOby8LldmH20ltoRCEFoahSZVBqSIgMAAu0t2MwmlWDHUSU29zBFubC+sor1lVW9vgjT7G3Sv0/lhEdWmhoO4bMv3kHnqVbcnb6PbC6Pnt4u3J2+DwD68YO1J6mSXWtkfJBparTgmqZGEWBBAMBHgxcAAH/9Pg0+mRdiKbS0KXqd5OKSkCvTRb/V09sFT7v/v7M76OntQjgUQV9/NwAgHIqU7loj44OMT2gtphXBWIUeXxZiqSIg0QwS6UwRFBmAp90PT7vfNtEBoIYf2UVH0mIaAm0Bw4qkDJVfx64VNb6lTdHPSSVyMBpfyFap9wFw6jwrX/ZdcaaIna2SMvpfNVqgDoUaNZog6NhMGQqZcCiCcChS8JvJ+TiS83HnriWGUmY5A0mWIMmSfh5oCxgqxJvA610nsb29rif8yvITHJEbCkLtiNygm8Che8uKr6lRWXuaQ19/NzpPtf5rEunHaFQk/WOnBgDU3Lg8xqiRAIoayjdePOa/z4eapkahxTRMTc4UPItXCQDSt+N4f+TTgvpbs3O6CuFQRM+PO4lH6gsxINbcuDzGAGBqcgafDPQY5gWvkniNV0k0AN7ltJiG5OKSrshCLIXhK0NFtk6qAICr4wS+e+9reGXJVhFT16LQ4OHMwJxCGY1HInCABfX7dO37r8Zsc8RlpIAw/Wb8vanJmQIQMb8IRhxvrKybv6apUVwa/gNDFz+07AxLEKu1gxGcmUpW45Bd4wIsiNDNb0vOEdtk12IatJhmCSm6E9UpCkGLHBJL/9kf4XSMc7RCNAKwCkHROPjvamoU9XOLOHq22xICQMmq7GipawVnBEZwwa08AODhzYgOYxsRFrB7smYX4QzAgHffYDSP+vztfpVCxsjFeAgnrrVvBsQ920URFbr4zQfMSQjxytTPLe6ea+1mobASJ4EBFtQ/RsWuEyoaWk4s1akhPFc5YqdKxUB4JzKz2J8//sExTEX3fn8Z+Mlws44vw6MTKg9wNTzAjPKsrIqYLVtpu1SE8LldON/hZcOjE6q4lr8aHmAEVTHX4jcdrHZIHqxsFSjDdwQdE0xFcoTvSaNCe75Uznd4GQ+TnI/D0+4vUHjfjOxVkSNWG3Z8eJEqfJhR0teU89UbuQ/tXxnlRyKdgVeW4HO7dAgKtd9mE2pV2O/w6IRq98KGYHxupUAVMW8qGlo8hJP9XLOkf66mKGJuiOcVBeFfDYhJbRReYkhZ5UjZFenr79Z33s1g4hubanxjUyUY4NnrBkcbdOWexdLUo5RZr1mdg6Xubs25dqtObaXCqpSxpypXiNSzTt9EVf1S12lP77s1+wHIAcgByAsGIu6elB1EHAztNiBKBdrzSSMPsJP/MaFn2E1RyjrX+j+juV3dfwB+tdpgEdUZoAAAAABJRU5ErkJggg==" width="50" height="56" transform="translate(170,4) rotate(10)" style="image-rendering:pixelated"/>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAA4CAYAAACGwxqMAAADm0lEQVR42u2aP0gbURzHfxedSpaS4OAdzdWQ8KDgJCK4iSDUQUEodHRxKjhZECniUBwyCXVxMLi0UJGaoQW3VpBC6ZBmeuSIPiEHRRO6iKsd7O94d/fu7l3ucibVBwfm3v353Pd9f7/3ew+VqSdTkFRbe14k2fxjePQ04+q7PmtDq/EH3n6pU79nKEkCx9FS0GdtMImXkFGd8L/zhazv9Q2jBbTG6J0ApzM5F+z4zCTopCi8ntE6AJwArbEHS0Rqt0q6m06K8OPoJDlgMqoT3qPfvl4KryutHgIAwMrmvO3c9qfX0RXe2Fkm6DlUZn1pyxUUswtjZGhEtZ/0ANZURepcaGAeFocMAGDveJswWrfAZxfGCADAxakpBfHy1ZzUuVDACCvym06KoJMi7B1vk49bZc9n5AtZaBityN4OnOk2dpZJ0MN55f2gncBR8rAQWAZWBO4FPTSiwsWpCZ8PftKoQW0DDgsqCz00osL+bhVWNueBGfYJIeyH9N3EkQpS16lIULC8WF509X0/+gWaqkBp9RD0gg4Xp6Z1jM9MuqbvQOBOYEV9PDSC8wGH0OMzkzA9PADTwwOeNYdnWguC1Qt6aMUR3CudMYPBxL8ivmYw0FQFmuaNXC3BDGZBOWH8YJ19PKxfLaCpCuzvVmFi7RkAAOzvVqVmOAu4XKpQmTzspTjfj30iZZvmjQ3s+qwdb7UmUl4GtrR66FLMOdyaqsCb97+l6weptFYuVSgzmAXrNRK8TT68q3Skmqx/A2sJL0gvm4henC9koWleCm1xLxahoYDXl7Ysm/BW4W3hp2BUdTtacYhsUi5V6OLKHBHZIeyC9ap9ThOxRJDf+2IRilVYmFohSOVEg042ffl9YOJZomne2MDxb15VTVWsNeKd7kuIsgTm5ibcWiGdyVnbBDw02isVN1C+kLUOfngRFhXGAys17L9qn1OsRRpGy6pLEL6rlsCX8Mpetc8pP/w8NDZaY7RhtKwP54up/3umk2l+exC8ik6lNVWxZQdUGZ+HHo59B57fC0ZAtIRor8Hpca/9iK5lCf6F6UyOBNUPmBl6rloLUk52MdozQee0T6LA6UyOhBnmoAotMYX5yaJn01pUBXuu+OkLheMMvFQ3Aq6bthnsZrDFHXCJWCJswN3vfYkH4F5Z5kcJtKB7HyyBaQ2PsHkZ73P+U0hXLCGC01QFaGeb7S5oWmM0FTesaFr1UquTDxjspYCTuf8v9yzn6tlX4RsAAAAASUVORK5CYII=" width="44" height="56" transform="translate(280,46) rotate(-6)" style="image-rendering:pixelated"/>
    <path d="M3 3h8v2H3v12h8V5h2v12h8V5h-8V3h10v16H13v2h-2v-2H1V3h2zm16 7h-4v2h4v-2zm-4-3h4v2h-4V7zm2 6h-2v2h2v-2z" transform="translate(32,172) rotate(-12) scale(1.5)" fill="rgba(255,255,255,0.09)"/>
    <path d="M18 2H6v6h2v2h2v4H8v2H6v6h12v-6h-2v-2h-2v-4h2V8h2V2zm-2 6h-2v2h-4V8H8V4h8v4zm-2 6v2h2v4H8v-4h2v-2h4z" transform="translate(222,180) rotate(8) scale(1.25)" fill="rgba(255,255,255,0.09)"/>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAgCAYAAAAMq2gFAAABy0lEQVR42mN0knNiwAW8g000GBgYGMzcreFiChpqDAwMDAwHNu9iYGBgYJjfvfEGAxGAEZdFjbPyNZD5MAuwgXi7bIKWMTHQCWD4CN0n2HwjLs+Jwn/58DtBnzFhixNkC/AFGTpILPXXGPCgQ7EIOXXhA7CgQgcOvm449TAr8isyeAebaKhpSYlIq8gRTGUHNu9iUFBXZvj68Q8cH9i8i+HBrbsMCurKDIIirCKG1hoiF47dfDNwQWfmbk10sGHLoPO7N96AiTv4umENwoFJDLQELKRqwJZX8OUfsi3CFv74kvXgiaMHN24NTGKIt8u+gVxoovMJFap44wjmKwUNNXiEwwxbeGiqBrrhiaX+GrhCgr71EbYqm1CdhCsEHtx+gLUEYWFgYGDYuvbMDahFGsQkDnRLkeVwtSEGpmQ4tfMoUYUrrgiHBRtRqQ6mWEFVgWjX4oqXwVWoPrj9gOHVvac4q3jkYCLG9yzobQbkFAXLjFvXnsHbwNxev4yBgYGBIURLUmPNtec3Bj7DWkiKYs0/MoIQD2NzJbIemLon7/9gZa+59vwGY5V5OIYGbADdMmwWDY6q3LMximB59uDGLYY1aRNRxIjRh6wfADxAt0h5KdUdAAAAAElFTkSuQmCC" width="26" height="32" transform="translate(300,210)" style="image-rendering:pixelated"/>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAgCAYAAADud3N8AAABrklEQVR42s1WMUsDMRh9p8VBSlvogYNi06GSyZ8g0sFN+hOki4tDp87S2cnBpYPi7FS6aKeig6t2CnZJoTrVoSBUiqCD5Ph6TexdL/X6wcHlu4+8vJf3XeIUt4uwEeVqiQPA/uGB9rsULzg9PhcAsIIYwrHBtFwtcVZgv4y60suzApsaA0DCxsrp5FTedrM1NY5NXuugR3snQr1TljRvHfT6/oJTx+ryscgbyUi1eoUDAOM7WvPIrvS+tZut+d2rA9KN/XvKCsyrWX55a/UK1zHyM6YGonnl4FCgswD/qltoy1iTl/YY7cGgzEODKrf6G54C+hdA91QdZwv9DVph6nejjpGJJT3WAoFSWU2TmvIqrs4a4l9OmUjyzsvOZJ6ZoOVqiZuAogLGL2+tXuEmt5lYUZfeXD4Fvw0+3Da47hY3K2RX4vHuGQAgOlIkszkOAB/vveWUd+LeS3uTMtf1G99lXi1lGoTtaj6dDw0IAJ9faTeVcgAA7kbGfZM9MR4NB2vrGVc949FwsJzyhgkqL43+67e2nkqeiAImOlL481ubzkRe7XUym+MKOBZ5fwBOh82a2viOsAAAAABJRU5ErkJggg==" width="29" height="32" transform="translate(58,258) rotate(6)" style="image-rendering:pixelated"/>
    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAA4CAYAAAAB8vOKAAADJklEQVR42tVYT4QbURj/bTqHtSNWSkSIMiJr7LK2uksoPWz1UiKqvZRIlbI0t2XpZU97LNVLSymVWPaylwp7SU+lhA5lST2NlUsY2xxyiISS0MPsm33z8t78y24z/Ygk4833e7/f9833vm8Wtm9t46rsweEjfS0dt/+/vV8jonVKEKfrBwUdAFKa/LaWOQALLLIY5mCxICxTmuJgyTJif7fMAVrmQOpLEcl3ul8nIkAWQOb0vDP2JKAAgFa2wGSW0hSHs7X0JSN6/bzTt1XgNz0l7/pBQY/ngHgOGLSti7JNVNQJKurEBnvy+499jbL0AoxGIsVzzm82ThV1AjWbhJpN2v8/vf7uUGHpfdMXqOJHDpHMAJBJKFCzSft6JqEApvf9C7KKRDNZBAbAAcZbqVglntnr194NbzjAh2c9X5uIRCJJmdJYU5kdSbK3heFZT8iu94WEjylrWrmgpxpNK1HoifLiNgCg8fEHAOD4p0lmZson1CiXR/eCbSah2GDXWvCv0gI9MtTY+FLJvy3lYBpfSWimboAs2OhlHt3+GN3+GHdH7fDyep0413KI83UXuDx9ZIwzCQW/nm7+R8VBJK2IJcssCMOZmIqABu2ATNOb93RZGfRKrCBgDqaLq8tYXF2eOVaizUe7XQnTTVDF5sLUT3GZGZS2rzywG3g0Z5lUo+n6aKwcGVg5MtCpTefB4edneujG7I5hWD8M+Zp8Oqk3a3WilQv6weObU8Bsh6gAwKuNiaOjK1044R13++Opcsj3vJ1anQw3HurUH+2lWHChvKwsrOOm2SP0I9oE3ejO7gnZ2T0hFJBtVaORSPyO3KSlbGVyU8bUZ6lYJTSujh7pwxsrFuxgRB2JWkw27m7rfDVm+XRSZ3fd7Y+FzFhgut5tbaCYejlh5ecljm5FEj2fXir4UcKTKR/Pf157g7KgarkpNv+YBo2nWwa7ZXFMFk86owRJqJnn0zCxjPRYMf9Z5vneln2QHxergZ2x97v5cBR8rWy9nGR7IlHv49Z+8p2hqIeWvnoVzalhjJ/qT/frJMYCioD8vAoIuon5J1KYsS/M6PgXnzthHnJV72kAAAAASUVORK5CYII=" width="29" height="56" transform="translate(172,276) rotate(-5)" style="image-rendering:pixelated"/>
    <circle cx="340" cy="325" r="3.5" fill="rgba(255,255,255,0.08)"/>
    <circle cx="16" cy="338" r="3" fill="rgba(255,255,255,0.07)"/>
  </g>
</svg>`.trim();

function toDataUri(svg: string) {
  return `url("data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}")`;
}

// Nilai mentah CSS background-image-nya, diekspor terpisah supaya komponen
// lain (Hero, banner kedua) bisa menumpuknya DI ATAS warna solid mereka
// sendiri — supaya motif stiker terasa menyambung ke seluruh halaman,
// bukan cuma muncul tiba-tiba begitu area hero berakhir.
export const stickerBackgroundImage = toDataUri(STICKER_TILE_SVG);

// Style siap-pakai: spread ke elemen pembungkus halaman.
// Ukuran tile 360px — perbesar/perkecil angka ini kalau ingin motifnya
// terasa lebih renggang/rapat.
export const stickerBackgroundStyle: React.CSSProperties = {
  backgroundImage: stickerBackgroundImage,
  backgroundRepeat: "repeat",
  backgroundSize: "360px 360px",
};
