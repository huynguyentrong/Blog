import { Button } from "components/button";
import React from "react";
import styled from "styled-components";

const HomeBannerStyles = styled.div`
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  margin-bottom: 60px;
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      max-width: 600px;
      color: white;
    }
    &-heading {
      font-size: 36px;
      margin-bottom: 20px;
    }
    &-desc {
      line-height: 1.75;
      margin-bottom: 40px;
    }
  }
`;

const HomeBanner = () => {
  return (
    <HomeBannerStyles>
      <div className="min-h-[300px] md:min-h-[480px] lg:min-h-[520px] py-10 md:py-16 lg:py-20  mb-15 md:mb-20 lg:mb-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
            <div className="order-2 w-full text-center text-white lg:max-w-xl xl:max-w-2xl lg:text-left lg:order-1">
              <h1 className="mb-4 text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl md:mb-6 lg:mb-8">
                Monkey Blogging
              </h1>
              <p className="mb-6 text-base leading-relaxed sm:text-sm md:text-lg md:mb-8 lg:mb-10 opacity-90">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laudantium magnam similique accusantium natus esse facilis!
                Quaerat voluptates possimus dolorem officiis pariatur, repellat,
                cupiditate porro, quidem molestiae impedit laudantium neque quo!
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button
                  to="/sign-up"
                  kind="secondary"
                  className="px-6 py-3 md:px-8 md:py-4"
                >
                  Get started
                </Button>
              </div>
            </div>
            <div className="flex justify-center order-1 w-full lg:w-auto lg:order-2">
              <img
                src="/img-banner.png"
                alt="banner"
                className="object-contain w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
