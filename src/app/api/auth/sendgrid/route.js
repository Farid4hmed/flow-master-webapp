import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)


export async function POST(request) {
    try {
        const { otp, recipient, sender, subject } = await request.json();
        const html = await getHtml(otp)

        const response = await sendgrid.send({
            to: `${recipient}`,
            from: `${sender}`,
            subject: `${subject}`,
            html: `${html}`,
        })
  
        return new Response(JSON.stringify({ message: "success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "error", error: error.toString() }), {
            status: 500, 
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}


// async function sendEmail(req, res) {
//     try {
//         const html = getHtml(req.body.otp)

//         await sendgrid.send({
//             to: `${req.body.recipient}`,
//             from: `${req.body.sender}`,
//             subject: `${req.body.subject}`,
//             html: html,
//         })
//     } catch (error) {
//         return res.status(error.statusCode || 500).json({ error: error.message });
//     }

//     return res.status(200).json({ error: "" })
// }

// export default sendEmail;


async function getHtml(otp) {
    const html = `   <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<style type="text/css">
body, p, div {
font-family: inherit;
font-size: 14px;
}
body {
color: #000000;
}
body a {
color: #1188E6;
text-decoration: none;
}
p { margin: 0; padding: 0; }
table.wrapper {
width:100% !important;
table-layout: fixed;
-webkit-font-smoothing: antialiased;
-webkit-text-size-adjust: 100%;
-moz-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
}
img.max-width {
max-width: 100% !important;
}
.column.of-2 {
width: 50%;
}
.column.of-3 {
width: 33.333%;
}
.column.of-4 {
width: 25%;
}
ul ul ul ul  {
list-style-type: disc !important;
}
ol ol {
list-style-type: lower-roman !important;
}
ol ol ol {
list-style-type: lower-latin !important;
}
ol ol ol ol {
list-style-type: decimal !important;
}
@media screen and (max-width:480px) {
.preheader .rightColumnContent,
.footer .rightColumnContent {
    text-align: left !important;
}
.preheader .rightColumnContent div,
.preheader .rightColumnContent span,
.footer .rightColumnContent div,
.footer .rightColumnContent span {
    text-align: left !important;
}
.preheader .rightColumnContent,
.preheader .leftColumnContent {
    font-size: 80% !important;
    padding: 5px 0;
}
table.wrapper-mobile {
    width: 100% !important;
    table-layout: fixed;
}
img.max-width {
    height: auto !important;
    max-width: 100% !important;
}
a.bulletproof-button {
    display: block !important;
    width: auto !important;
    font-size: 80%;
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.columns {
    width: 100% !important;
}
.column {
    display: block !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
}
.social-icon-column {
    display: inline-block !important;
}
}
</style>
<!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
body {font-family: 'Muli', sans-serif;}
</style><!--End Head user entered-->
</head>
<body>
<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
    <div class="webkit">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
        <tr>
        <td valign="top" bgcolor="#FFFFFF" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td width="100%">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                    <td>
                        <!--[if mso]>
<center>
<table><tr><td width="600">
<![endif]-->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                <tr>
                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
<tr>
<td role="module-content">
    <p>Some Text here</p>
</td>
</tr>
</table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6" data-distribution="1">
<tbody>
<tr role="module-content">
    <td height="100%" valign="top"><table width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
<tbody>
    <tr>
    <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="72aac1ba-9036-4a77-b9d5-9a60d9b05cba">
<tbody>
<tr>
    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
    
    <a href="https://soa.ac.in"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="200" alt="" data-proportionally-constrained="true" data-responsive="false" src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Siksha_%E2%80%98O%E2%80%99_Anusandhan.png/220px-Siksha_%E2%80%98O%E2%80%99_Anusandhan.png" height="200"></a></td>
</tr>
</tbody>
</table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="948e3f3f-5214-4721-a90e-625a47b1c957" data-mc-module-version="2019-10-22">
<tbody>
<tr>
    <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#F6F6F6;" height="100%" valign="top" bgcolor="#F6F6F6" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Enter the OTP to finish Signing Up</span></div><div></div></div></td>
</tr>
</tbody>
</table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a10dcb57-ad22-4f4d-b765-1d427dfddb4e" data-mc-module-version="2019-10-22">
<tbody>
<tr>
    <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#F6F6F6;" height="100%" valign="top" bgcolor="#F6F6F6" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Your OTP for email verification is ${otp}, please enter this otp on the sign up page to finish the sign up process.</span></div><div></div></div></td>
</tr>
</tbody>
</table></td>
    </tr>
</tbody>
</table></td>
</tr>
</tbody>
</table></td>
                                </tr>
                                </table>
                                <!--[if mso]>
                            </td>
                            </tr>
                        </table>
                        </center>
                        <![endif]-->
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
    </div>
</center>
</body>`


    return html
}
