const nodemailer = requuire('nodemailer');

const mailHelper = async (options) => {
    const  transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });
    
      const message = {
        from: 'vin@lco.dev', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: optipns.message, // plain text body
        
      }


      // send mail with defined transport object
       await transporter.sendMail(message);
}


module.exports = mailHelper;