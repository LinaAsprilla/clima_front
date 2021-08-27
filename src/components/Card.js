import React from "react";
import "./Card.css";
import TempIcon from "../assets/icons/temp.png";
import HumidityIcon from "../assets/icons/humidity.png";
import WindIcon from "../assets/icons/wind.png";
import { Card, Col, Row } from "antd";

const CardWeather = ({ img, nameCity, temp, humidity, wind }) => {
  let date = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };

  return (
    <>
      <div className="o_container_card">
        <h2>{nameCity}</h2>
        <p className="date">{date.toLocaleDateString("default", options)} </p>
        <h1>{temp}° </h1>{" "}
        <p className="climate">
          <span>Clima / </span>
          {temp >= 25 ? "Soleado" : "Nublado"}
        </p>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="City" src={img} />}
        >
          <Row gutter={[0, 8]} className="row_footer">
            <div className="div_footer">
              <Col span={4}>
                <img src={TempIcon} alt="Temperatura" />
              </Col>
              <Col span={18}>
                <p> Temperatura</p>
              </Col>
              <Col>
                <p>{temp}° </p>
              </Col>
            </div>
            <div className="div_footer">
              <Col span={4}>
                <img src={HumidityIcon} alt="Humedad" />
              </Col>

              <Col span={18}>
                <p> Humedad</p>
              </Col>
              <Col>
                <p>{humidity}% </p>
              </Col>
            </div>
            <div className="div_footer wind">
              <Col span={4}>
                <img src={WindIcon} alt="Viento" />
              </Col>
              <Col span={16}>
                <p> Viento</p>
              </Col>
              <Col>
                <p>{wind}m/s </p>
              </Col>
            </div>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default CardWeather;
