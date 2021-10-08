import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import axios from "axios";
import jwt from "jwt-decode";
import Auth from "./Auth.js";
import "./css/login.css";
import logo from "./css/bobafish-logo.svg";

const Login = (props) => {
    useEffect(
        () =>
            axios
                .get(process.env.REACT_APP_BACKEND_API_URL + "/api")
                .then((response) => {
                    if (response.status === 200) {
                        console.log("Backend API server online.");
                    }
                })
                .catch(() => {
                    setErrorMsg(
                        "Backend API server is offline. Please try again at a later time."
                    );
                }),
        []
    );

    const [user, setState] = useState({
        username: "",
        password: "",
    });

    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };
    const handleLogin = (event) => {
        setErrorMsg("Loading...");
        if (!user.username.length && !user.password.length) {
            setErrorMsg("Please enter a valid username and password.");
        } else if (!user.username.length) {
            setErrorMsg("Please enter a valid username.");
        } else if (!user.password.length) {
            setErrorMsg("Please enter a valid password.");
        } else {
            setErrorMsg("Connected.");
            const payload = {
                username: user.username,
                password: user.password,
            };
            axios
                .post(
                    process.env.REACT_APP_BACKEND_API_URL +
                        "/api/account/login",
                    payload
                )
                .then((response) => {
                    if (response.status === 200) {
                        const token = response.data.token;
                        const data = jwt(token);
                        setState((prevState) => ({
                            ...prevState,
                            message: response.data.message,
                        }));
                        localStorage.setItem(
                            "accessToken",
                            response.data.token
                        );
                        Auth.authenticate(data.user);
                        redirectToHome();
                    }
                })
                .catch((e) => {
                    console.log(e.toJSON());
                    let errorMessage = e.toJSON().message;
                    if (errorMessage.includes(401)) {
                        setErrorMsg(
                            "The username or password you entered is incorrect. Please try again."
                        );
                    } else if (errorMessage.includes("Network Error")) {
                        setErrorMsg(
                            "Backend API server is offline. Please try again at a later time."
                        );
                    }
                });
        }
        event.preventDefault();
    };

    const redirectToHome = () => {
        props.history.push("/home");
    };

    return (
        <div>
            <Helmet>
                <style type="text/css">{`
                    html {
                        background-color: #5e779d;
                    }
                `}</style>
            </Helmet>

            <svg
                id="logoText"
                width="300"
                height="39"
                viewBox="0 0 300 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12.86 12.66C15.0986 12.6349 17.3015 13.2228 19.23 14.36C21.1373 15.4642 22.731 17.0372 23.86 18.93C24.8362 20.6294 25.4088 22.5303 25.5336 24.4862C25.6585 26.442 25.3322 28.4003 24.58 30.21C23.2843 33.2518 20.8618 35.6743 17.82 36.97C16.2699 37.6387 14.5981 37.9791 12.91 37.97C11.2081 38.0136 9.53012 37.5619 8.07999 36.67C6.72844 35.8093 5.60353 34.6363 4.79999 33.25V37.35H0.799988V1.35001H4.79999V17.41C5.59905 16.0203 6.7249 14.8464 8.07999 13.99C9.51068 13.0926 11.1714 12.6305 12.86 12.66V12.66ZM12.86 34.02C14.3823 34.0405 15.8795 33.6315 17.18 32.84C18.4658 32.0726 19.5332 30.988 20.28 29.69C21.0407 28.3465 21.4406 26.8289 21.4406 25.285C21.4406 23.7411 21.0407 22.2235 20.28 20.88C19.5189 19.5863 18.4464 18.5034 17.16 17.73C15.8663 16.959 14.3859 16.5578 12.88 16.57C11.4281 16.5358 10.0005 16.9476 8.78998 17.75C7.62542 18.5422 6.69612 19.6339 6.09999 20.91C5.48045 22.2941 5.16019 23.7935 5.16019 25.31C5.16019 26.8265 5.48045 28.3259 6.09999 29.71C6.69766 30.9828 7.63115 32.0684 8.79999 32.85C10.0053 33.6384 11.4199 34.046 12.86 34.02V34.02Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M39.94 37.95C37.8188 37.9667 35.7371 37.3768 33.94 36.25C32.3286 35.2188 30.9647 33.8447 29.9456 32.2257C28.9264 30.6067 28.2771 28.7827 28.0441 26.8839C27.811 24.9851 27.9999 23.0582 28.5973 21.2408C29.1947 19.4234 30.1858 17.7603 31.5 16.37C32.5811 15.2173 33.8793 14.2896 35.32 13.64C37.0294 12.8884 38.8952 12.5613 40.7584 12.6867C42.6215 12.8121 44.4267 13.3862 46.02 14.36C48.5597 16.0193 50.4459 18.5075 51.3575 21.401C52.2692 24.2945 52.1499 27.4145 51.02 30.23C50.4172 31.7127 49.5421 33.0694 48.44 34.23C47.3609 35.378 46.0662 36.3023 44.63 36.95C43.1578 37.6199 41.5574 37.9611 39.94 37.95V37.95ZM39.94 33.95C41.3852 33.9697 42.803 33.5551 44.01 32.76C45.2138 31.9753 46.1953 30.894 46.86 29.62C47.5563 28.2972 47.9201 26.8249 47.9201 25.33C47.9201 23.8352 47.5563 22.3628 46.86 21.04C46.1842 19.7675 45.1968 18.6872 43.99 17.9C42.8033 17.1185 41.4109 16.7077 39.99 16.72C38.5484 16.7036 37.1346 17.1179 35.93 17.91C34.7284 18.7015 33.7477 19.7855 33.08 21.06C32.3775 22.3952 32.0105 23.8813 32.0105 25.39C32.0105 26.8987 32.3775 28.3848 33.08 29.72C33.7665 30.9843 34.7691 32.0489 35.99 32.81C37.1744 33.548 38.5446 33.933 39.94 33.92V33.95Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M67.97 12.66C70.2086 12.6349 72.4115 13.2228 74.34 14.36C76.229 15.4709 77.8049 17.0434 78.92 18.93C79.8962 20.6294 80.4688 22.5303 80.5937 24.4862C80.7185 26.442 80.3922 28.4003 79.64 30.21C78.3443 33.2518 75.9218 35.6743 72.88 36.97C71.3299 37.6387 69.6581 37.9791 67.97 37.97C66.2682 38.0124 64.5906 37.5609 63.14 36.67C61.7861 35.8036 60.661 34.6236 59.86 33.23V37.33H55.86V1.33002H59.86V17.39C60.6591 16.0003 61.7849 14.8264 63.14 13.97C64.5879 13.0719 66.2667 12.6165 67.97 12.66V12.66ZM67.92 34.02C69.4423 34.0405 70.9395 33.6315 72.24 32.84C73.5258 32.0726 74.5932 30.988 75.34 29.69C76.1007 28.3465 76.5005 26.8289 76.5005 25.285C76.5005 23.7411 76.1007 22.2235 75.34 20.88C74.5789 19.5863 73.5064 18.5034 72.22 17.73C70.9263 16.959 69.4459 16.5578 67.94 16.57C66.4936 16.5319 65.07 16.9366 63.86 17.73C62.6954 18.5222 61.7661 19.6139 61.17 20.89C60.5504 22.2742 60.2302 23.7735 60.2302 25.29C60.2302 26.8065 60.5504 28.3059 61.17 29.69C61.7676 30.9628 62.7011 32.0484 63.87 32.83C65.0702 33.6235 66.4812 34.0381 67.92 34.02V34.02Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M104.02 13.33H108.02V37.33H103.97L103.82 33.27C103.087 34.6449 102.017 35.8113 100.71 36.66C99.3084 37.5437 97.6764 37.9925 96.02 37.95C94.3023 37.964 92.6002 37.6236 91.02 36.95C89.5055 36.2928 88.1282 35.3565 86.96 34.19C85.7866 33.0257 84.8524 31.6431 84.21 30.12C83.5635 28.6006 83.2228 26.9688 83.2071 25.3177C83.1915 23.6666 83.5012 22.0287 84.1188 20.4973C84.7363 18.966 85.6495 17.5713 86.8062 16.393C87.9629 15.2147 89.3404 14.2758 90.86 13.63C92.3834 12.9658 94.0281 12.6253 95.69 12.63C97.4491 12.5898 99.1833 13.0511 100.69 13.96C102.091 14.8207 103.269 15.9991 104.13 17.4L104.02 13.33ZM96.15 34.04C97.6178 34.0779 99.0611 33.6586 100.28 32.84C101.419 32.0278 102.312 30.917 102.86 29.63C103.45 28.2264 103.727 26.7112 103.671 25.1897C103.616 23.6682 103.23 22.1771 102.54 20.82C101.893 19.5693 100.935 18.5055 99.76 17.73C98.5421 16.9562 97.1226 16.5595 95.68 16.59C94.1551 16.57 92.6562 16.9864 91.36 17.79C90.0937 18.5802 89.0588 19.6911 88.36 21.01C87.6237 22.3876 87.2779 23.9402 87.36 25.5C87.4252 27.0331 87.8906 28.5225 88.71 29.82C89.5003 31.0928 90.5926 32.1507 91.89 32.9C93.181 33.6576 94.6531 34.0516 96.15 34.04V34.04Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M119.26 7.40001V13.33H126.26V17.33H119.26V37.33H115.26V17.33H112.16V13.33H115.26V7.40001C115.245 6.22172 115.557 5.06234 116.16 4.05002C116.752 3.05945 117.585 2.23404 118.58 1.65001C119.572 1.05585 120.704 0.738175 121.86 0.730013C122.776 0.729322 123.682 0.919221 124.52 1.28765C125.359 1.65607 126.111 2.19495 126.73 2.87001L123.86 5.73001C123.637 5.42111 123.337 5.17624 122.99 5.02001C122.64 4.85462 122.257 4.76922 121.87 4.77001C121.525 4.7647 121.182 4.82929 120.862 4.9599C120.543 5.09051 120.253 5.28444 120.01 5.53002C119.763 5.77336 119.569 6.06503 119.44 6.3868C119.311 6.70856 119.25 7.05349 119.26 7.40001Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M132.05 8.94001C131.758 8.94625 131.467 8.8937 131.196 8.78547C130.925 8.67724 130.678 8.51555 130.47 8.31001C130.263 8.10454 130.101 7.85755 129.996 7.58524C129.891 7.31294 129.845 7.02149 129.86 6.73C129.854 6.43914 129.909 6.15028 130.021 5.88174C130.133 5.61319 130.3 5.37083 130.51 5.17001C130.72 4.96764 130.967 4.80868 131.238 4.70228C131.509 4.59588 131.799 4.54413 132.09 4.55001C132.681 4.53877 133.253 4.76163 133.68 5.17001C133.889 5.37132 134.054 5.614 134.164 5.88259C134.275 6.15118 134.328 6.43979 134.32 6.73C134.329 7.02046 134.277 7.30962 134.167 7.57848C134.057 7.84735 133.891 8.08983 133.68 8.29C133.467 8.50439 133.213 8.67273 132.933 8.78455C132.652 8.89638 132.352 8.9493 132.05 8.94001V8.94001ZM130.05 13.33H134.05V37.33H130.05V13.33Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M148.47 37.79C147.179 37.7401 145.904 37.4905 144.69 37.05C143.521 36.6404 142.431 36.0314 141.47 35.25C140.597 34.5557 139.91 33.6554 139.47 32.63L142.92 31.14C143.221 31.7492 143.667 32.2747 144.22 32.67C144.875 33.1677 145.604 33.5592 146.38 33.83C147.174 34.1091 148.009 34.2544 148.85 34.26C149.691 34.2654 150.526 34.1267 151.32 33.85C152.04 33.6089 152.69 33.1932 153.21 32.64C153.694 32.1153 153.955 31.4235 153.94 30.71C153.956 30.3552 153.893 30.0014 153.754 29.6743C153.616 29.3473 153.406 29.0554 153.14 28.82C152.546 28.3389 151.868 27.9726 151.14 27.74C150.327 27.48 149.507 27.23 148.68 26.99C147.167 26.6162 145.688 26.1144 144.26 25.49C143.082 24.9867 142.036 24.2204 141.2 23.25C140.432 22.2643 140.039 21.0383 140.09 19.79C140.059 18.3992 140.491 17.0375 141.32 15.92C142.17 14.8117 143.293 13.9434 144.58 13.4C145.942 12.8037 147.414 12.5005 148.9 12.51C150.742 12.4904 152.561 12.9194 154.2 13.76C155.708 14.5034 156.956 15.685 157.78 17.15L154.54 19.04C154.244 18.4449 153.817 17.925 153.29 17.52C152.707 17.0869 152.059 16.7493 151.37 16.52C150.66 16.2686 149.913 16.1335 149.16 16.12C148.278 16.073 147.396 16.1952 146.56 16.48C145.813 16.7103 145.14 17.1347 144.61 17.71C144.13 18.265 143.871 18.9765 143.88 19.71C143.858 20.0548 143.917 20.3999 144.052 20.7177C144.188 21.0355 144.396 21.3172 144.66 21.54C145.257 21.9982 145.935 22.3377 146.66 22.54C147.5 22.79 148.42 23.08 149.41 23.4C150.805 23.8397 152.168 24.3743 153.49 25C154.657 25.5401 155.699 26.3165 156.55 27.28C157.335 28.2308 157.741 29.4381 157.69 30.67C157.712 32.0679 157.245 33.4297 156.37 34.52C155.464 35.6358 154.286 36.5001 152.95 37.03C151.528 37.6003 150 37.8594 148.47 37.79V37.79Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M183.7 24.59V37.33H179.7V24.73C179.718 23.3155 179.399 21.9172 178.77 20.65C178.208 19.4743 177.35 18.4647 176.28 17.72C175.263 17.01 174.05 16.6326 172.81 16.64C171.561 16.6154 170.337 16.9941 169.32 17.72C168.295 18.4707 167.491 19.4825 166.99 20.65C166.427 21.9357 166.144 23.3265 166.16 24.73V37.33H162.16V1.33002H166.16V16.73C166.801 15.4345 167.823 14.3665 169.09 13.67C170.347 13.0065 171.748 12.663 173.17 12.67C175.131 12.6342 177.054 13.2033 178.68 14.3C180.265 15.4072 181.536 16.9058 182.37 18.65C183.254 20.505 183.708 22.5353 183.7 24.59V24.59Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M215.09 37.95C212.881 37.9633 210.696 37.503 208.68 36.6C206.698 35.7065 204.911 34.4324 203.42 32.85C201.892 31.2426 200.684 29.3591 199.86 27.3C198.145 22.9392 198.145 18.0908 199.86 13.73C200.684 11.6709 201.892 9.7874 203.42 8.17999C204.911 6.59761 206.698 5.32349 208.68 4.42999C210.696 3.527 212.881 3.06666 215.09 3.08C217.714 3.05511 220.3 3.70599 222.6 4.97C224.846 6.19147 226.79 7.89985 228.29 9.97L224.72 11.89C223.59 10.4145 222.141 9.21438 220.48 8.37999C218.898 7.56528 217.153 7.11871 215.375 7.07369C213.596 7.02866 211.831 7.38635 210.21 8.12C208.698 8.81755 207.339 9.80642 206.21 11.03C205.06 12.2736 204.155 13.722 203.54 15.3C202.572 17.7446 202.311 20.4124 202.789 22.998C203.266 25.5836 204.462 27.9825 206.24 29.92C207.371 31.1368 208.73 32.1188 210.24 32.81C211.862 33.5419 213.629 33.8961 215.408 33.8459C217.187 33.7956 218.932 33.3423 220.51 32.52C222.139 31.6675 223.567 30.4778 224.7 29.03L228.27 30.97C226.776 33.0457 224.831 34.7553 222.58 35.97C220.295 37.2625 217.715 37.9444 215.09 37.95Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M234.19 37.33V3.73002H245.98C247.698 3.70569 249.389 4.16296 250.86 5.05003C252.298 5.91927 253.486 7.14566 254.31 8.61002C255.088 10.0489 255.52 11.6488 255.574 13.2835C255.628 14.9182 255.301 16.5431 254.62 18.03C254.011 19.3186 253.118 20.4524 252.008 21.3461C250.897 22.2398 249.599 22.8703 248.21 23.19L256.37 37.33H251.71L243.71 23.53H238.19V37.33H234.19ZM238.19 19.5H245.59C246.646 19.5131 247.684 19.2327 248.59 18.69C249.491 18.1678 250.236 17.4154 250.75 16.51C251.282 15.556 251.561 14.4821 251.561 13.39C251.561 12.298 251.282 11.224 250.75 10.27C250.236 9.36466 249.491 8.61229 248.59 8.09002C247.684 7.54739 246.646 7.26697 245.59 7.28002H238.19V19.5Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
                <path
                    d="M261.58 37.33L268.08 3.73001H271.18L280.25 27.59L289.3 3.73001H292.4L298.92 37.33H294.86L290.13 12.95L281.61 35.51H278.95L270.43 12.95L265.72 37.33H261.58Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                />
            </svg>

            {/* <h1 className="title">bobafish CRM</h1> */}

            <img
                title="bobafish"
                src={logo}
                alt="bobafish logo"
                className="logo"
            ></img>
            <div id="formID">
                <form className="form" onSubmit={handleLogin}>
                    <label id="usernameInput">Username</label>
                    <br />
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        // placeholder="Username"
                        value={user.username}
                        onChange={handleChange}
                    />
                    <br />
                    <label id="passwordInput">Password</label>
                    <br />
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        // placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <input
                        type="submit"
                        value="Login"
                        className="loginButton"
                    />
                </form>
                <p className="errorMsg">{errorMsg ? errorMsg : ""}</p>
            </div>
        </div>
    );
};

export default withRouter(Login);
