import React from "react";
import styles from "./Contact.module.css";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";

const Contact = () => {
  return (
    <>
      <Header></Header>
      <div className={styles.contactContainer}>
        <div className={styles.formSection}>
          <h2>
            Fill in the registration form below, BaShip will contact you to
            schedule a demo session soon.
          </h2>

          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">Note</label>
              <textarea id="message" name="message" required></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Get advice now!
            </button>
          </form>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.companyInfo}>
            <h2>BaShip offers the optimal solution for your order</h2>
            <p>Email: SupportBaShip@gmail.com</p>
            <p>Hotline: 086868686</p>
            <p>19 Nguyen Huu Tho, Tan Hung, District 7, Ho Chi Minh City</p>
            <div className={styles.mapContainer}>
              {" "}
              {/* New container for styling */}
              <iframe
                title="BaShip Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1d3919.603222625119!2d106.68150291515453!3d10.76294999233155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1d10.7629499!2d106.6815029!4m5!1s0x31752f4c9984c4c7%3A0xb9411503719c8b2b!2zQUMwMy0wNCBI4bqhbSBzbyA5LC road66LCBQaMaw4bujbmcgVGjhuqNuIETinCwgVGjDoCBxaOG7QSBESOG7QWMsIFRow6BuaCBwaOG7byBIbyBDaGkgaW1inhM!5e0!3m2!1svi!2sus4!4v1701161477271!5m2!1svi!2sus" // Use embed URL
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
