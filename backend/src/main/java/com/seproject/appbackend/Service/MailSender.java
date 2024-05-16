// package com.seproject.appbackend.Service;

// import org.springframework.stereotype.Service;
// import org.springframework.web.bind.annotation.RequestMethod;

// import org.springframework.web.bind.annotation.RequestMapping;

// import java.util.Properties;
// import org.springframework.beans.factory.annotation.Value;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// @Service
// public class MailSender {

//     private static final Logger logger = LoggerFactory.getLogger(MailSender.class);

//     @Value("${mail.sender.email}")
//     private String senderEmail;

//     @Value("${mail.sender.password}")
//     private String password;

//     @Value("${mail.smtp.host}")
//     private String smtpHost;

//     @Value("${mail.smtp.port}")
//     private String smtpPort;

//     @Value("${mail.smtp.auth}")
//     private String smtpAuth;

//     @Value("${mail.smtp.starttls.enable}")
//     private String smtpStarttlsEnable;

//     @RequestMapping(value = "/save", method = RequestMethod.POST)
//     public void sendDataMail(String email, String firstName, String lastName, String currURL, String verification_id) {
//         String verification_link = currURL + "verify?token=" + verification_id;

//         Properties props = new Properties();
//         props.put("mail.smtp.host", smtpHost);
//         props.put("mail.smtp.port", smtpPort);
//         props.put("mail.smtp.auth", smtpAuth);
//         props.put("mail.smtp.starttls.enable", smtpStarttlsEnable);

//         jakarta.mail.Session session = jakarta.mail.Session.getInstance(props, new jakarta.mail.Authenticator() {
//             @Override
//             protected jakarta.mail.PasswordAuthentication getPasswordAuthentication() {
//                 return new jakarta.mail.PasswordAuthentication(senderEmail, password);
//             }
//         });

//         try {
//             jakarta.mail.Message message = new jakarta.mail.internet.MimeMessage(session);

//             message.setFrom(new jakarta.mail.internet.InternetAddress(senderEmail));

//             message.setRecipients(jakarta.mail.Message.RecipientType.TO,
//                     jakarta.mail.internet.InternetAddress.parse(email));

//             message.setSubject("Bitte bestätigen Sie Ihre Mail-Adresse!");

//             String charset = "UTF-8";

//             String linkText = "[Hier klicken, um Ihre E-Mail-Adresse zu bestätigen]";
//             String link = "<a href='" + verification_link + "'>" + linkText + "</a>";

//             StringBuilder contentBuilder = new StringBuilder();

//             contentBuilder.append("<html><body style='font-family: Calibri; font-size: 15px;'>");

//             contentBuilder.append("Guten Tag ").append(firstName).append(" ").append(lastName).append(
//                     ",<br><br><br>Ihre persönliche Analyse aus dem Backup-Risiko-Radar liegt bereit.<br><br><br>Bitte bestätigen Sie kurz, dass Sie kostenfreie Services, wie die Bewertung des Backup-Risiko-Radars<br>Ihres Hamburger Herstellers und Lösungsanbieters für Datensicherung, NovaStor angefordert haben.<br><br>");

//             contentBuilder.append("").append(link);

//             contentBuilder.append("").append(
//                     "<br><br>Sollten Sie den Bericht nicht angefordert haben, brauchen Sie nichts zu unternehmen.<br><br><br>Mit freundlichen Grüßen aus Hamburg,<br>Ihr NovaStor-Team<br><br><hr style='border: 1px solid #787878; margin: 10px 0; width: 30%;'><br>Neumann-Reichardt-Str. 27-33, Haus 11<br>22041 Hamburg<br><br>Telefon: <a href='tel:+4940638090'>+49 40 63809 0</a><br>E-Mail: <a href='mailto:kontakt@novastor.de'>kontakt@novastor.de</a><br><br>Geschäftsführer: Stefan Utzinger<br>Sitz der Gesellschaft: Hamburg | Amtsgericht Hamburg HRB 53850<br>USt-IdNr.: DE160004982 | Steuer-Nr.: 51/747/00488 | <a href='https://www.novastor.de/agb'>AGB</a><br><br>Mehr Einblicke in unsere ganzheitlichen Lösungen unter: <a href='https://www.novastor.de'>www.novastor.de</a>");

//             contentBuilder.append("</body></html>");
            
//             message.setContent(contentBuilder.toString(), "text/html; charset=" + charset);

//             jakarta.mail.Transport.send(message);
//             logger.info("EMail was send!");
//         } catch (jakarta.mail.MessagingException e) {
//             logger.error("there was an error sending the mail!: {}", e.getMessage());
//         }

//     }

// }