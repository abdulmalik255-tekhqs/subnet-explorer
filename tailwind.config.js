/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      keyframes: {
        dash: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        dash: "dash 5s linear infinite",
      },
      backgroundImage: {
        footer: "linear-gradient(90deg, #DEE5FF 0%, #DFEEFF 100%)",
        hover: "linear-gradient(270deg, #DEE5FF 0%, #DFEEFF 100%)",
        unconfirmedBlock:
          "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
        mempoolfinalblock:
          "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)",
        blocks:
          "linear-gradient(180deg, #FAFBFD 0%, rgba(246, 247, 248, 0) 100%)",
        ballotedBlock:
          "linear-gradient(90deg, hsla(63, 100%, 77%, 1) 0%, hsla(331, 74%, 68%, 1) 100%)",
      },
      boxShadow: {
        navbar: "0px 4px 20px 0px #B4BDEA33",
        stats: "0px 8px 19.2px 0px #BDC5D133",
        txBox: "0px 8px 19.2px 0px #BDC5D133",
        account: "0px 8px 15px 0px #D2E3FD26",
      },
      colors: {
        "bryt-grey-100": "#F8F9FA",
        "bryt-grey-200": "#E9ECEF",
        "bryt-grey-300": "#ADB5BD",
        "bryt-grey-500": "#ABBAC7",
        "bryt-grey-700": "#6C757D",
        "bryt-primary-main": "#003768",
        "bryt-primary-light": "#08268DE5",
        "bryt-red": "#DC3545",
        "bryt-green": "#00A186",
        "bryt-yellow-light": "#FFC10740",
      },
    },
  },
  plugins: [],
};
