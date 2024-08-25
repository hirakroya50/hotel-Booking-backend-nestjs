export function forgetPasswordEmail(token: string) {
  return `
  
<body style="font-family: system-ui, math, sans-serif">
  <div>
    <h1>Hotel Booking page , Forget password request</h1>
    <br />
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      "
    >
      <p>please click on the link for reset the password :</p>

      <a href="http://localhost:3002/forgetPassword/${token}">click here</a>
      <p>(Dev mode)</p>
    </div>
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      "
    >
      <p>please click on the link for reset the password :</p>
      <a href="https://hotel-booking-appp-nextjs.vercel.app/forgetPassword/${token}"
        >click here</a
      >
      <p>(production mode)</p>
    </div>
  </div>
</body>

    
    
    `;
}
