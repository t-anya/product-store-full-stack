import React from "react";
import Header from "../components/Header/Header";
import HomeFooter from "../components/Footer/HomeFooter";
import Carousel from "../components/Description/Carousel";
import Categories from "../components/Description/Categories";
import Blogs from "../components/Description/Blogs";

function HomePage() {
  return (
    <>
      <Header />
      <section className="tw-flex tw-justify-center tw-text-xl">
        <Carousel className="w-100" />
      </section>
      <section className="tw-flex tw-justify-center tw-text-xl">
        <Categories className="w-100" />
      </section>
      <section className="tw-flex tw-justify-center tw-text-xl">
        <Blogs className="w-100" />
      </section>
      <HomeFooter />
    </>
  );
}

export default HomePage;
