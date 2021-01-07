const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const moment = require('moment');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({  
  extended: false  
}));  

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/note.html')
})
app.post('/sendEmail', (req, res) => {
  sendEmail(req.body)
  .then(
    () => {
      res.send({
        status: 200,
        data: {
          code: 200
        },
        msg: 'ok'
      })
    },
    (err) => {
      res.send({
        status: 200,
        data: {
          code: 201 // 发送失败
        },
        msg: JSON.stringify(err)
      })
    }
  )
})

app.listen(3333, () => {
  console.log('http:127.0.0.1:3333');
})


function sendEmail({
  subject,
  from,
  to,
  cc,
  user,
  pass,
  work, 
  project, 
  problem, 
  study
}) {
  // 创建发送对象
  const transporter = nodemailer.createTransport({
    host: "email.vanke.com", // 主机
    port: 587,
    secure: false,
    auth: {
      user,
      pass
    }
  })

  const time = moment().format("YYYY-MM-DD")
  const mailOptions = {
    from,
    to, // 收件人邮箱，多个人逗号隔开
    cc, // 抄送人
    subject,
    html: 
    `
    <p>Hi, 文强：</p>

    <p>这是本人 ${time} 的日报，请查收！ </p>
    <table style="table-layout:fixed;border-collapse: collapse;border: 1px solid #000;">
      <tr style="background-color: #002060;color: #fff;">
        <th style="min-width: 100px;">今天工作内容</th>
        <th style="min-width: 100px;">明日计划工作内容</th>
        <th style="min-width: 100px;">遇到的问题</th>
        <th style="min-width: 100px;">经验心得</th>
      </tr>
      <tr>
        <td style="border-right:1px solid #002060;">
          ${work}
        </td>
        <td style="border-right:1px solid #002060;">
          ${project}
        </td>
        <td style="border-right:1px solid #002060;">
          ${problem}
        </td>
        <td>
          ${study}
        </td>
      </tr>
    </table>
    `
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // throw(err)
        reject(err)
      } else {
        resolve(true)
        console.log('邮件发送:' + info.response);
      }
    })
  })
  
}


