package com.seproject.appbackend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MailSender {

    private static final Logger logger = LoggerFactory.getLogger(MailSender.class);

    @Value("${mail.sender.email}")
    private String senderEmail;

    @Value("${mail.sender.password}")
    private String password;

    @Value("${mail.smtp.host}")
    private String smtpHost;

    @Value("${mail.smtp.port}")
    private String smtpPort;

    @Value("${mail.smtp.auth}")
    private String smtpAuth;

    @Value("${mail.smtp.starttls.enable}")
    private String smtpStarttlsEnable;

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public boolean sendDataMail(String email, String username, String currURL, String verification_id) {
        String verification_link = currURL + "verify?token=" + verification_id;

        Properties props = new Properties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.auth", smtpAuth);
        props.put("mail.smtp.starttls.enable", smtpStarttlsEnable);

        jakarta.mail.Session session = jakarta.mail.Session.getInstance(props, new jakarta.mail.Authenticator() {
            @Override
            protected jakarta.mail.PasswordAuthentication getPasswordAuthentication() {
                return new jakarta.mail.PasswordAuthentication(senderEmail, password);
            }
        });

        try {
            jakarta.mail.Message message = new jakarta.mail.internet.MimeMessage(session);

            message.setFrom(new jakarta.mail.internet.InternetAddress(senderEmail));

            message.setRecipients(jakarta.mail.Message.RecipientType.TO,
                    jakarta.mail.internet.InternetAddress.parse(email));

            message.setSubject("Bitte bestätigen Sie Ihre Mail-Adresse!");

            String charset = "UTF-8";

            String linkText = "[Hier klicken, um Ihre E-Mail-Adresse zu bestätigen]";
            String link = "<a href='" + verification_link + "'>" + linkText + "</a>";

            StringBuilder contentBuilder = new StringBuilder();

            contentBuilder.append("<html><body style='font-family: Calibri; font-size: 15px;'>");

            contentBuilder.append("Guten Tag ").append(username).append(
                    ",<br><br><br>Bitte bestätigen Sie ihre Email Adresse, damit wir diese Verifizieren können und ihr Account erhalten bleibt<br><br>");

            contentBuilder.append("").append(link);

            contentBuilder.append("").append(
                    "<br><br>Sollten Sie sich nicht bei RodeCoin registriert haben, brauchen Sie nichts zu unternehmen.<br><br><br>Mit freundlichen Grüßen aus Hamburg,<br>Ihr RodeCoin-Team<br><br><hr style='border: 1px solid #787878; margin: 10px 0; width: 30%;'><br>Musterstraße 9<br>21129 Hamburg<br><br>Telefon: <a href='tel:+49123456789'>+49 12 34567 89</a><br>E-Mail: <a href='mailto:mustermail@gmail.com'>mustermailsupport@gmail.com</a><br><br>Geschäftsführer: Cem Cetin und Maxim Celik<br>Sitz der Gesellschaft: Hamburg | Amtsgericht Hamburg ABC 123456<br>USt-IdNr.: DE123456789 | Steuer-Nr.: 12/345/678986");

            contentBuilder.append("</body></html>");
            
            message.setContent(contentBuilder.toString(), "text/html; charset=" + charset);

            jakarta.mail.Transport.send(message);
            logger.info("EMail was send!");
            return true;
        } catch (jakarta.mail.MessagingException e) {
            logger.error("there was an error sending the mail!: {}", e.getMessage());
            return false;
        }

    }

}