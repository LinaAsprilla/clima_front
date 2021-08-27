import { useState } from "react";
import "./App.css";
import { Button, Col, Input, message, Row, Select, Space, Spin } from "antd";
import CardWeather from "./components/Card";
import ImgCali from "./assets/img/background.png";
import clienteAxios from "./config/axios";
import tokenAuth from "./config/token";

const { Option } = Select;

function App() {
  //PROPIEDADES DE LA CIUDAD SELECCIONADA
  const [selectedCity, setSelectedCity] = useState({
    city: "",
    img: "",
    temp: "",
    humidity: "",
    speed: "",
  });
  //ESTADO DEL SPINNER
  const [loading, setLoading] = useState(false);
  //ESTADO DE LA CONTRASEÑA
  const [password, setPass] = useState("");
  //ESTADO DEL ERROR
  const [error, setError] = useState(false);
  //ESTADO DE LA INFORMACIÓN CARGADA
  const [data, setData] = useState(false);

  //DESTRUCTURING
  const { city, img, temp, humidity, speed } = selectedCity;

  //CAPTURAR VALOR DEL SELECT
  const handleChange = (value) => {
    setSelectedCity({ ...selectedCity, city: value });
  };

  //CAPTURAR VALOR DEL INPUT
  const handleChangeInput = (e) => {
    setPass(e.target.value);
  };

  //ACCIÓN DEL BOTÓN PASSWORD

  const handleClickPass = async () => {
    //VALIDAR QUE NO HAYAN CAMPOS VACÍOS

    if (password === "") {
      setError(true);
      message.error({ content: "Campo vacío", duration: 3 });
      localStorage.removeItem("token");
      return;
    }

    //VALIDAR CONTRASEÑA CORRECTA
    try {
      const respuesta = await clienteAxios.post("/auth", { password });
      localStorage.setItem("token", respuesta.data.token);
      setError(false);
      message.success({ content: "Autenticado correctamente", duration: 2 });
    } catch (error) {
      setError(true);
      message.error({ content: error.response.data.msg, duration: 3 });
      localStorage.removeItem("token");
    }
  };

  //ACCIÓN DEL BOTÓN INFORMACIÓN
  const handleClick = async () => {
    //VALIDAR QUE NO HAYAN CAMPOS VACÍOS

    if (city === "" || password === "") {
      setError(true);
      message.error({ content: "Campo vacío", duration: 3 });
      return;
    }

    //VALIDAR PERMISO
    try {
      const token = localStorage.getItem("token");
      if (token) {
        tokenAuth(token);
      }

      if (!token) {
        message.error({
          content: "No hay token, permiso no válido",
          duration: 3,
        });
        return;
      }

      //LLENAR INFO DE LA CIUDAD
      if (city === "Santiago de Cali") {
        const res = await clienteAxios.get("/Clima");
        setSelectedCity({
          ...selectedCity,
          img: ImgCali,
          temp: res.data[0].main.temp,
          humidity: res.data[0].main.humidity,
          speed: res.data[0].wind.speed,
        });
        setError(false);
        setLoading(true);
      }
    } catch (error) {
      setError(true);
      console.log(error.response.data.msg);
      message.error({ content: error.response.data.msg, duration: 3 });
    }

    //NO CARGAR EL SPINNER SI EXISTEN DATOS
    if (data) {
      setLoading(false);
    }
    //CARGAR DATOS DESPUÉS DE 3SG
    setTimeout(() => {
      setData(true);
      setLoading(false);
    }, 1000);
  };

  //CONVERTIR KELVIN A CELSIUS
  let convertTemp = temp - 273.15;

  return (
    <>
      <div className="o_container">
        <h1>Aplicación sobre el clima</h1>
        <Row className="info_1">
          <Space>
            <Col>
              <Input.Password
                placeholder="Ingrese 1234"
                value={password}
                onChange={handleChangeInput}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={handleClickPass}>
                Validar contraseña
              </Button>
            </Col>
          </Space>
        </Row>
        <Row className="info">
          <Space>
            <Col span={8}>
              <Select
                placeholder="Selecciona una ciudad"
                style={{ width: 200 }}
                onChange={handleChange}
              >
                <Option value="Santiago de Cali">Cali</Option>
              </Select>
            </Col>

            <Col>
              <Button type="primary" onClick={handleClick}>
                Mirar información
              </Button>
            </Col>
          </Space>
        </Row>
        {loading ? <Spin /> : null}
        {data && !error ? (
          <Row wrap>
            <Space>
              <CardWeather
                img={img}
                nameCity={city}
                temp={convertTemp}
                humidity={humidity}
                wind={speed}
              />
            </Space>
          </Row>
        ) : null}
      </div>
    </>
  );
}

export default App;
