import React from "react";
import Header from "../../layout/Header/Header";
import styles from "./Home.module.scss";

const Home = () => {
  const features = ["Feature One", "Feature Two", "Feature Three"];

  return (
    <>
      <Header></Header>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Welcome to My Website</h1>
          <p className={styles.subtitle}>
            This is a simple home page created without Material-UI. Explore and
            enjoy!
          </p>
          <button className={styles.button}>Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.grid}>
            {features.map((feature, index) => (
              <div className={styles.card} key={index}>
                <h3 className={styles.cardTitle}>{feature}</h3>
                <p className={styles.cardDescription}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam scelerisque convallis.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
