import React from "react";
import styles from "./Contact.module.scss";
import Header from "../../layout/Header/Header";

const Contact = () => {
  return (
    <>
      <Header></Header>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you. Fill out the form below or contact us
            through the provided details.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Contact Form */}
          <div className={styles.card}>
            <h2>Send us a message</h2>
            <form className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.button}>
                Submit
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className={styles.card}>
            <h2>Get in touch</h2>
            <div className={styles.info}>
              <h3>Phone</h3>
              <p>+1 (123) 456-7890</p>
            </div>
            <div className={styles.info}>
              <h3>Email</h3>
              <p>contact@mywebsite.com</p>
            </div>
            <div className={styles.info}>
              <h3>Address</h3>
              <p>
                123 Main Street, Suite 456
                <br />
                Hometown, Country 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
