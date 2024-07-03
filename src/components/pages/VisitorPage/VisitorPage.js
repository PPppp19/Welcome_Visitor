import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import MaterialTable, { MTableToolbar } from "material-table";
import { useSelector, useDispatch } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import SplitPane from "react-split-pane";
import Card from "@material-ui/core/Card";
import ImageUploading from "react-images-uploading";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Slider from "react-slick";
import CameraIcon from "@mui/icons-material/CameraAlt";
import UploadIcon from "@mui/icons-material/UploadFile";
import TakeIcon from "@mui/icons-material/RadioButtonChecked";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VisitorPage.css"; // Import the CSS file

import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Input,
  colors,
} from "@material-ui/core";
import {
  makeStyles,
  withStyles,
  ThemeProvider,
  createMuiTheme,
  createTheme,
} from "@material-ui/core/styles";
import {
  red,
  green,
  purple,
  teal,
  deepOrange,
  blueGrey,
  yellow,
} from "@material-ui/core/colors/";
import * as swrfileActions from "../../../actions/swrfile.action";

import * as orderIDActions from "../../../actions/orderID.action";

import * as VisitorHeaderActions from "../../../actions/visitorheader.action";

import * as CheckoutActions from "../../../actions/checkout.action";

import * as swrIDActions from "../../../actions/swrID.action";

import * as loginActions from "../../../actions/login.action";

import * as headerActions from "../../../actions/swrheader.action";

import * as employeeActions from "../../../actions/employee.action";

import * as followerActions from "../../../actions/follower.action";

import followerReducer from "../../../reducers/follower.reducer";
import { add, values } from "lodash";

import CssBaseline from "@material-ui/core/CssBaseline";
import { grey } from "@mui/material/colors";

// import { createTheme } from "@mui/material/styles";

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "red",
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#242105",
      backgroundColor: "red",
      color: "red",
    },
    aa: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#242105",
    },
    secondary: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#242105",
    },
    default: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#242105",
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
    body: {
      backgroundColor: "red",
    },

    success: {
      main: "#4caf50",
    },
  },
});

const SRMTYPE = [
  {
    value: "add",
    label: "Add",
  },
  {
    value: "modify",
    label: "Modfy",
  },
];

const SRSTYPE = [
  {
    value: "add",
    label: "Add",
  },
];

const SWRTYPE = [
  {
    value: "srs",
    label: "SRS",
  },
  {
    value: "srm",
    label: "SRM",
  },
];

const GMTYPE = [
  {
    value: "PHAISA_KUM",
    label: "PHAISA_KUM",
  },
];

const CIOTYPE = [
  {
    value: "WUTINA_ULI",
    label: "WUTINA_ULI",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 60,
  },
  paper: {
    padding: theme.spacing(2),
    color: "red",
    backgroundColor: "#efe5d1",
    // backgroundImage: "url(https://ibb.co/C5NxQ4v)", // Use the image URL here
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  margin: {
    marginTop: "0.4rem",
    marginRight: "0.4rem",
    margin: theme.spacing(0.3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderTop: 1,
    borderColor: "#E0E0E0",
    borderStyle: "solid",
  },
  wrapper: {
    margin: "3px",
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const FilePage = (props) => {
  const canvasRef = useRef(null);
  const [currentStream, setcurrentStream] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setcurrentStream(stream);
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const closeCamera = () => {
    currentStream.getTracks().forEach(function(track) {
      track.stop();
    });

    // let tracks = currentStream.getTracks();
    // tracks.forEach((track) => track.stop());
    // videoRef.current.srcObject = null;
  };

  const takePicture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const dataUrl = canvasRef.current.toDataURL("image/png");
    // setImageSrc(dataUrl);
    setFile(dataUrl);
    // setFile(dataUrl);
    handleStopCamera();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setFile(file);
    setFile(URL.createObjectURL(file));
  };

  const initialFileDetail = {
    vReference: "aa",
    vOrderno: "bb",
    vName: "cc",
    vLine: "dd",
    vType: "ee",
    vRemark1: "ff",
    vRemark2: "gg",
  };

  const initialswrnumber = {
    vReference: "",
    vName: "",
    vLine: "",
    vType: "",
    vRemark1: "",
    vRemark2: "",
  };

  const initialheader = {
    vID: "",
    vSwrname: "",
    vVersion: "",
    vSwrtype: "",
    vReqdate: "",
    vFinishdate: "",
    vRemark: "",
    vRequester: loginActions.getTokenUsername(),
    vDepthead: "",
    vDev: "",
    vAppdevmanager: "",
    vGM: "PHAISA_KUM",
    vCIO: "WUTINA_ULI",
  };

  const dateNow = new Date(); // Creating a new date object with the current date and time
  const year = dateNow.getFullYear(); // Getting current year from the created Date object
  const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
  const month = // Setting current Month number from current Date object
    monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
      ? `0${monthWithOffset}`
      : monthWithOffset;
  const date =
    dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
      ? `0${dateNow.getUTCDate()}`
      : dateNow.getUTCDate();

  const materialDateInput = `${year}-${month}-${date}`; // combining to format for defaultValue or value attribute of material <TextField>

  const date2 = new Date();
  const hour = date2.getHours();
  const min = date2.getMinutes();
  var min2 = ("0" + min).slice(-2);
  var hour2 = ("0" + hour).slice(-2);
  const time = hour2 + ":" + min2;

  const initialvisitorheader = {
    vCono: "BangkokRanch",
    vDivi: "",
    vLocation: "",
    vID: "00000000",
    vIMG: "",
    vTimein: "",
    vTimeout: "",
    vLicense: "",
    vName: "",
    vSurname: "",
    vTel: "",
    vReason: "",
    vEmployee: "",
    vCompany: "",
    vMeetdate: materialDateInput,
    vMeettime: time,
    vEmail: "",
  };

  const initialsign = {
    vSigndate: "dd/mm/yyyy",
  };

  const initialswdetail = {
    vDetailtype: "",
    vPurpose: "",
    vScope: "",
    vDescription: "",
    vPlan: "",
    vDetail: "",
    vCondition: "",
    vPurpose: "",
  };

  //handletextfield

  const [idhead, setIDHEAD] = useState("00000000");
  const [conohead, setCONOHEAD] = useState("00000000");
  const [divihead, setDIVIHEAD] = useState("00000000");
  const [locationhead, setLOCATIONHEAD] = useState("00000000");

  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [file, setFile] = useState(null);

  const [id, setID] = useState(false);
  const [type, setType] = useState(false);
  const [swrname, setSwrname] = useState(false);
  const [version, setVersion] = useState(false);
  const [reqdate, setReqdate] = useState(false);
  const [findate, setFindate] = useState(false);
  const [remark, setRemark] = useState(false);
  const [depthead, setDepthead] = useState(false);
  const [developer, setDeveloper] = useState(false);
  const [appdevmanager, setAppdevmaneger] = useState(false);
  const [gm, setGM] = useState(false);
  const [cio, setCIO] = useState(false);

  //////////////////

  //handlebutton

  const [create, setCreate] = useState(false);
  const [clear, setClear] = useState(false);
  const [save, setSave] = useState(false);
  const [update, setUpdate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [reject, setReject] = useState(false);
  const [editdisable, setEditDisable] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleCreate = () => {
    setCreate(true);

    // setSave(true);
    // setClear(true);
    // setSubmit(true);
    // setEditDisable(false);

    // setID(true);
    // setType(true);
    // setSwrname(true);
    // setVersion(true);
    // setReqdate(true);
    // setFindate(true);
    // setRemark(true);
    // setDepthead(true);
    // setDeveloper(true);
    // setAppdevmaneger(true);
    // setGM(true);
    // setCIO(true);
  };

  const handleClear = () => {
    setSave(false);
    setClear(false);
    setCreate(true);
    setSubmit(false);
    setEditDisable(false);

    setID(false);
    setType(false);
    setSwrname(false);
    setVersion(false);
    setReqdate(false);
    setFindate(false);
    setRemark(false);
    setDepthead(false);
    setDeveloper(false);
    setAppdevmaneger(false);
    setGM(false);
    setCIO(false);
  };
  ////////////////

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const handleClosefalse = () => setOpen(false);

  const fileInputRef = useRef(null);
  const create1 = true;

  const handleImageClick = () => {
    setIsModalOpen1(true);
  };

  const handleupload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setIsModalOpen1(false);
    }
  };

  const handlecamera = () => {
    // todo camera

    setIsModalOpen1(false);
    setIsModalOpen2(true);

    openCamera();
  };

  const handleClose1 = () => setIsModalOpen1(false);

  const handleClose2 = () => setIsModalOpen2(false);

  const [visitorheader, setvisitorheader] = useState(initialvisitorheader);

  const dispatch = useDispatch();
  const classes = useStyles();

  const employeeReducer = useSelector(({ employeeReducer }) => employeeReducer);

  const employeeset = employeeReducer.result ? employeeReducer.result : [];

  const followerReducer = useSelector(({ followerReducer }) => followerReducer);

  /////// Camera //////

  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  const handleStopCamera = () => {
    // alert(currentStream);
    closeCamera();
    setIsModalOpen2(false);
  };

  const handleStartCamera = () => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request access to the user's camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Set the video element's source to the camera stream
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraOn(true);
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  };

  // useEffect(() => {

  //   // Check if the browser supports getUserMedia
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     // Request access to the user's camera
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true })
  //       .then((stream) => {
  //         // Set the video element's source to the camera stream
  //         videoRef.current.srcObject = stream;
  //         videoRef.current.play();
  //       })
  //       .catch((err) => {
  //         console.error("Error accessing the camera: ", err);
  //       });
  //   }
  // }, []);

  ///////////////////////

  useEffect(() => {
    let params = props.match.params;
    // dispatch(employeeActions.getEmployee());
    console.log("PPPPPP");
    setvisitorheader({
      ...visitorheader,
      vCono: params.cono,
      vDivi: params.divi,
      vLocation: params.location,
    });

    setCONOHEAD(params.cono);
    setDIVIHEAD(params.divi);
    setLOCATIONHEAD(params.location);
  }, []);

  // useEffect(() => {
  //   dispatch(followerActions.getFollower(values.vID));
  // }, []);

  const columnsFollower = [
    {
      title: "ชื่อ-สกุล",
      field: "H_SURNAME",
      headerStyle: { whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
        flex: 1,
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.H_SURNAME}
        </Typography>
      ),
    },
  ];

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
  };
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const showVisitorForm = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <div>
            {/* <button onClick={openCamera}>Open Camera</button> */}

            {/* <div>
              <video ref={videoRef} width="400" height="300" autoPlay />
              <canvas
                ref={canvasRef}
                width="400"
                height="300"
                style={{ display: "none" }}
              />
            </div>
            {imageSrc && (
              <div>
                <h3>Captured Image:</h3>
                <img src={imageSrc} alt="Captured" />
              </div>
            )}
          </div> */}

            {/* <div> */}
            <CSSTransition
              in={open}
              timeout={300}
              classNames="modal"
              unmountOnExit
            >
              <div className="modal-overlay">
                <div className="modal">
                  <Modal
                    open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        maxHeight: "80vh", // Adjust as needed
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        overflow: "auto",
                        outline: "none",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              // bgcolor: "primary.main",
                              // color: "primary.contrastText",
                              bgcolor: "#e81e26",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              วิธีการใช้งาน โปรแกรม Visitor
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box
                            sx={{
                              bgcolor: "white",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <img
                              width={450}
                              height={550}
                              src={
                                "https://i.ibb.co/CPDFQKd/2b6edcfd8a721ba9b93949ff9b17c3df-0.png"
                              }
                              alt=""
                            />

                            {imageSrc && (
                              <div>
                                <h3>Captured Image:</h3>
                                <img src={imageSrc} alt="Captured" />
                              </div>
                            )}

                            <br></br>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              bgcolor: "#e81e26",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              วิธีการเพิ่มผู้ติดตาม
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              bgcolor: "white",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <img
                              width={450}
                              height={550}
                              src={
                                "https://i.ibb.co/vzf2NQH/2b6edcfd8a721ba9b93949ff9b17c3df-1.png"
                              }
                              alt=""
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                            >
                              ข
                            </Typography>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Button
                              style={{
                                backgroundColor: "#e81e26",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                width: "50%",
                              }}
                              appearance="primary"
                              onClick={async () =>
                                //todo send email

                                {
                                  let formData = new FormData();
                                  formData.append("vCONO", conohead);
                                  formData.append("vDIVI", divihead);
                                  formData.append("vLocation", locationhead);

                                  let orderID = await dispatch(
                                    orderIDActions.addOrderID(formData)
                                  );

                                  //alert(orderID.ID);
                                  setvisitorheader({
                                    ...visitorheader,
                                    vID: orderID.ID,
                                  });

                                  setIDHEAD(orderID.ID);
                                  setOpen(false);
                                  handleCreate();
                                }
                              }
                            >
                              ตกลง
                            </Button>
                            <br></br>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Modal>
                </div>
              </div>
            </CSSTransition>
          </div>

          <div>
            <CSSTransition
              in={isModalOpen1}
              timeout={300}
              classNames="modal"
              unmountOnExit
            >
              <div className="modal-overlay">
                <div className="modal">
                  <Modal
                    open={isModalOpen1}
                    onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 380,
                        maxHeight: "80vh", // Adjust as needed
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        overflow: "auto",
                        outline: "none",
                      }}
                    >
                      <Grid
                        container
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid
                          item
                          xs={6}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            style={{
                              width: "150px",
                              height: "150px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              padding: "20px",
                            }}
                            variant="contained"
                            size="large"
                            onClick={async () => {
                              handlecamera();
                            }}
                          >
                            <CameraIcon
                              style={{ fontSize: "80px", color: grey[500] }}
                            />
                            CAMERA
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            style={{
                              width: "150px",
                              height: "150px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              padding: "20px",
                            }}
                            variant="contained"
                            size="large"
                            onClick={async () => {
                              handleupload();
                            }}
                          >
                            <UploadIcon
                              style={{ fontSize: "80px", color: grey[500] }}
                            />
                            UPLOAD
                          </Button>
                        </Grid>
                      </Grid>
                      {/* <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              bgcolor: "white",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <button onClick={closeModal1}>ปิด</button>

                            <br></br>
                          </Box>
                        </Grid>
                      </Grid> */}
                    </Box>
                  </Modal>
                </div>
              </div>
            </CSSTransition>
          </div>

          <div>
            <CSSTransition
              in={isModalOpen2}
              timeout={300}
              classNames="modal"
              unmountOnExit
            >
              <div className="modal-overlay">
                <div className="modal">
                  <Modal
                    open={isModalOpen2}
                    onClose={handleStopCamera}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        maxHeight: "80vh", // Adjust as needed
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        overflow: "auto",
                        outline: "none",
                      }}
                    >
                      <Grid
                        container
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <div>
                          <video
                            id="video-container"
                            ref={videoRef}
                            width="400"
                            height="300"
                            autoPlay
                          />
                          <canvas
                            ref={canvasRef}
                            width="400"
                            height="300"
                            style={{ display: "none" }}
                          />
                          <button id="captureButton" onClick={takePicture}>
                            <TakeIcon
                              style={{ fontSize: "80px", color: white[500] }}
                            />
                          </button>
                        </div>
                      </Grid>
                      {/* <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              bgcolor: "white",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <button onClick={closeModal1}>ปิด</button>

                            <br></br>
                          </Box>
                        </Grid>
                      </Grid> */}
                    </Box>
                  </Modal>
                </div>
              </div>
            </CSSTransition>
          </div>

          <Grid item xs={12}></Grid>

          <Paper className={classes.paper}>
            <Grid container justifyContent="center" spacing={1}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    //   bgcolor: "primary.main",
                    color: "primary.contrastText",
                    p: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={12} spacing={1}>
                    <h2 style={{ color: "red" }}>Upload รูปถ่าย</h2>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    //   bgcolor: "primary.main",
                    color: "primary.contrastText",
                    p: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    width={300}
                    height={300}
                    src={
                      file
                        ? file
                        : "https://cdn0.iconfinder.com/data/icons/business-finance-vol-2-56/512/cashier_window_bank_finance-1024.png"
                    }
                    alt=""
                    onClick={handleImageClick}
                    style={{ marginBottom: 16, cursor: "pointer" }} // Add cursor pointer for better UX
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the file input
                    disabled={!create}
                    // onChange={(e) => setFile(e.target.files[0])}
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={1}
                sx={{ backgroundColor: "#E0E0E0" }}
              ></Grid>
            </Grid>
          </Paper>
          <br />
          <Paper className={classes.paper}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Grid container item xs={12} spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={12} spacing={1}>
                      <h2>ผู้มาติดต่อ</h2>
                    </Grid>

                    <Grid item xs={12} spacing={1}>
                      <TextField
                        fullWidth
                        required
                        disabled={create ? false : true}
                        size="small"
                        variant="outlined"
                        id="vCompany"
                        label="บริษัทผู้ติดต่อ"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vCompany}
                        values={(values.vCompany = visitorheader.vCompany)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vCompany: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} spacing={1}>
                      <TextField
                        fullWidth
                        required
                        disabled={create ? false : true}
                        size="small"
                        variant="outlined"
                        id="vLicense"
                        label="ทะเบียนรถ"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vLicense}
                        values={(values.vLicense = visitorheader.vLicense)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vLicense: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        type="date"
                        variant="outlined"
                        id="vMeetdate"
                        label="วันนัดเข้าพบ"
                        SelectProps={{
                          native: true,
                        }}
                        focused
                        // helperText="Please select your order"
                        value={visitorheader.vMeetdate}
                        values={(values.vMeetdate = visitorheader.vMeetdate)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vMeetdate: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        type="time"
                        variant="outlined"
                        id="vMeettime"
                        label="เวลาเข้าพบ"
                        focused
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"

                        value={visitorheader.vMeettime}
                        values={(values.vMeettime = visitorheader.vMeettime)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vMeettime: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>

                    <Grid item xs={4} spacing={1}>
                      <TextField
                        required
                        fullWidth
                        disabled={create ? false : true}
                        size="small"
                        variant="outlined"
                        id="vName"
                        label="ชื่อ"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vName}
                        values={(values.vName = visitorheader.vName)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vName: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={4} spacing={1}>
                      <TextField
                        fullWidth
                        required
                        disabled={create ? false : true}
                        size="small"
                        variant="outlined"
                        id="vSurname"
                        label="นามสกุล"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vSurname}
                        values={(values.vSurname = visitorheader.vSurname)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vSurname: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={4} spacing={1}>
                      <TextField
                        fullWidth
                        required
                        disabled={create ? false : true}
                        size="small"
                        variant="outlined"
                        id="vTel"
                        label="เบอร์โทร"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vTel}
                        values={(values.vTel = visitorheader.vTel)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vTel: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} spacing={1}>
                      <TextField
                        required
                        disabled={create ? false : true}
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        variant="outlined"
                        id="vReason"
                        label="เหตุผล"
                        SelectProps={{
                          native: true,
                        }}
                        // helperText="Please select your order"
                        value={visitorheader.vReason}
                        values={(values.vReason = visitorheader.vReason)}
                        onChange={(event) => {
                          setvisitorheader({
                            ...visitorheader,
                            vReason: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
            </Grid>
          </Paper>
          <br />
          <Paper className={classes.paper}>
            <Grid item xs={12}>
              <Grid container item xs={12} spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={12} spacing={1}>
                    <h2>ผู้ติดต่อ</h2>
                  </Grid>
                  <Grid item xs={12} spacing={1}>
                    <TextField
                      required
                      disabled={create ? false : true}
                      fullWidth
                      size="small"
                      variant="outlined"
                      id="vEmployee"
                      label="ผู้ติดต่อ"
                      SelectProps={{
                        native: true,
                      }}
                      // helperText="Please select your order"
                      value={visitorheader.vEmployee}
                      values={(values.vEmployee = visitorheader.vEmployee)}
                      onChange={(event) => {
                        setvisitorheader({
                          ...visitorheader,
                          vEmployee: event.target.value,
                        });
                      }}
                    ></TextField>
                  </Grid>
                  <br />

                  <Grid item xs={12} spacing={1}></Grid>
                </Grid>
              </Grid>
            </Grid>
            <br></br>
          </Paper>
          <br />

          <Paper className={classes.paper}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Grid container item xs={12} spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  <Grid container item xs={12} spacing={1}></Grid>
                  <Grid item xs={12} spacing={1}>
                    <h2>ผู้ติดตาม</h2>
                  </Grid>
                  <Grid item xs={12} spacing={1}>
                    <MaterialTable
                      icons={
                        {
                          // Add: () => <EditIcon style={{ color: "red" }} />,
                          // Edit: () => <EditIcon style={{ color: "orange" }} />,
                          // Delete: () => <DeleteIcon style={{ color: "red" }} />
                        }
                      }
                      editable={{
                        onRowAdd: (newData) =>
                          new Promise((resolve, reject) => {
                            // alert(JSON.stringify(newData));

                            let formData = new FormData();
                            formData.append("H_SURNAME", newData.H_SURNAME);
                            formData.append("vID", visitorheader.vID);
                            formData.append("vCONO", conohead);
                            formData.append("vDIVI", divihead);
                            formData.append("vLocation", locationhead);

                            resolve();
                            setTimeout(() => {
                              let NAME = newData.H_SURNAME;
                              let ID = visitorheader.vID;
                              let CONO = conohead;
                              let DIVI = divihead;
                              let LOCATION = locationhead;

                              // alert(NAME);
                              // alert(ID);

                              (async function() {
                                // await dispatch();
                                // followerActions.addFollower(formData);
                                // await dispatch(employeeActions.getEmployee());

                                await dispatch(
                                  followerActions.addFollower(formData)
                                );

                                // alert(visitorheader.vID);
                                await dispatch(
                                  followerActions.getFollower(
                                    ID,
                                    CONO,
                                    DIVI,
                                    LOCATION
                                  )
                                );
                                alert("Add Follower Complete.");
                              })();
                              resolve();
                            }, 1000);
                          }),
                        onRowDelete: (oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              let ID = oldData.vID;
                              let REMARK1 = oldData.REMARK1;
                              let CONO = conohead;
                              let DIVI = divihead;
                              let LOCATION = locationhead;

                              (async function() {
                                await dispatch(
                                  followerActions.deletefollower(
                                    ID,
                                    REMARK1,
                                    CONO,
                                    DIVI,
                                    LOCATION
                                  )
                                );
                                await dispatch(
                                  followerActions.getFollower(
                                    ID,
                                    CONO,
                                    DIVI,
                                    LOCATION
                                  )
                                );
                              })();
                              resolve();
                            }, 1000);
                            resolve();
                          }),

                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              let formData = new FormData();
                              let ID = visitorheader.vID;
                              let CONO = conohead;
                              let DIVI = divihead;
                              let LOCATION = locationhead;

                              formData.append("vID", ID);
                              formData.append("H_SURNAME", newData.H_SURNAME);
                              formData.append(
                                "oldH_SURNAME",
                                oldData.H_SURNAME
                              );
                              formData.append("vCONO", conohead);
                              formData.append("vDIVI", divihead);
                              formData.append("vLocation", locationhead);

                              (async function() {
                                await dispatch(
                                  followerActions.updateFollower(formData)
                                );
                                await dispatch(
                                  followerActions.getFollower(
                                    ID,
                                    CONO,
                                    DIVI,
                                    LOCATION
                                  )
                                );
                              })();
                              resolve();
                            }, 1000);
                          }),
                      }}
                      // icons={{}}
                      id="root_pr"
                      title={`เพิ่มผู้ติดตามกดที่นี่>>>`}
                      columns={columnsFollower}
                      data={
                        followerReducer.result ? followerReducer.result : []
                      }
                      options={{
                        pageSize: 8,
                        paging: true,
                        headerStyle: {
                          textAlign: "center",
                          borderLeft: 1,
                          borderRight: 1,
                          borderBottom: 1,
                          borderTop: 1,
                          borderColor: "#E0E0E0",
                          borderStyle: "solid",
                          paddingLeft: "6px",
                          paddingRight: "6px",
                          paddingBottom: "12px",
                          paddingTop: "12px",
                        },
                        search: false,
                        actionsColumnIndex: -1,
                        fixedColumns: {
                          // left: 2
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} spacing={3}>
                    <Grid item xs={12} spacing={3}>
                      <TransitionGroup>
                        <CSSTransition
                          key={location.key}
                          timeout={500}
                          classNames="slide"
                        >
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <Button
                              style={{
                                backgroundColor: "#881717",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                width: "25%",
                              }}
                              fullWidth
                              disabled={create ? false : true}
                              size="medium"
                              type="submit"
                              id="vSubmit"
                              variant="contained"
                              color="primary"
                              onClick={(event) => {
                                values.vSubmit = "SUBMIT";
                                values.vStatus = "10";
                              }}
                            >
                              SUBMIT
                            </Button>
                          </Box>
                        </CSSTransition>
                      </TransitionGroup>
                    </Grid>
                    <br />
                    <Grid item xs={12} spacing={3}></Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
            </Grid>
          </Paper>
          <br />
        </ThemeProvider>
      </form>
    );
  };

  return (
    <div className={classes.root}>
      {/* Header */}
      <Formik
        initialValues={{
          vID: "00000000",
          vIMG: "",
          vTimein: "",
          vTimeout: "",
          vLicense: "",
          vName: "",
          vSurname: "",
          vTel: "",
          vReason: "",
          vEmployee: "",
          vStatus: "00",
          vCono: "",
          vCompany: "",
          vMeetdate: "",
          vMeettime: "",
          vMail: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          //alert("xxxxxx");
          let formData = new FormData();

          //  formData.append("vID" , visitorheader.vID);

          (async function() {
            switch (values.vSubmit) {
              case "CLEAR":
                alert("CLEAR");
                // await dispatch(swrfileActions.fetchSWRFile());

                handleClear();

                break;
              case "SAVE":
                alert(JSON.stringify(values));

                //let formData = new FormData();
                formData.append("vSwrtype", values.vSwrtype);
                formData.append("vReqdate", "20240303");
                formData.append("vFinishdate", "20240303");
                formData.append("vRemark", values.vRemark);
                formData.append("vRequester", values.vRequester);
                formData.append("vDepthead", values.vDepthead);
                formData.append("vStatus", values.vStatus);

                let orderno = await dispatch(
                  headerActions.addSWRheader(formData)
                );

                alert(orderno);
                alert("SAVE");
                //await dispatch(swrdetailActions.fetchSWRdDetail());
                await dispatch(swrfileActions.fetchSWRFile());
                await dispatch(swrIDActions.doGetID());

                break;

              case "CREATE":
                alert("CREATE");
                // alert(JSON.stringify(values));

                let orderID = await dispatch(
                  orderIDActions.addOrderID(props.history)
                );

                alert(orderID.ID);
                setvisitorheader({
                  ...visitorheader,
                  vID: orderID.ID,
                });

                //alert(JSON.stringify(orderID.ID));

                // alert(JSON.stringify(orderID[0].ID));

                alert("ADD COMPLETE");

                break;

              case "SUBMIT":
                alert("SUBMIT");

                // alert(visitorheader.vID);

                props.history.push(
                  "/successpage/" + visitorheader.vID + "/Submit"
                );

                let formData = new FormData();
                formData.append("vID", idhead);
                formData.append("vIMG", values.vIMG);
                formData.append("vTimein", values.vTimein);
                formData.append("vTimeout", values.vTimeout);
                formData.append("vLicense", values.vLicense);
                formData.append("vName", values.vName);
                formData.append("vSurname", values.vSurname);
                formData.append("vTel", values.vTel);
                formData.append("vReason", values.vReason);
                formData.append("vEmployee", values.vEmployee);
                formData.append("vStatus", values.vStatus);
                formData.append("vCono", values.vCono);
                formData.append("vCompany", values.vCompany);
                formData.append("vMeetdate", values.vMeetdate);
                formData.append("vMeettime", values.vMeettime);
                formData.append("vEmployee", values.vEmployee);
                formData.append("vMail", values.vMail);
                formData.append("imagefile", file);
                formData.append("imagename", file);
                formData.append("vCONO", conohead);
                formData.append("vDIVI", divihead);
                formData.append("vLocation", locationhead);

                await dispatch(
                  VisitorHeaderActions.addVisitorHeader(formData, props.history)
                  // CheckoutActions.checkOut(formData)
                );

                /*

                alert("Submit COMPLETE");
                */
                break;

              // await dispatch(
              //   swrfileActions.addSWRfile(formData, props.history)
              // );
              // await dispatch(swrfileActions.fetchSWRFile());
              // break;
              default:
                break;
            }
          })();
        }}
      >
        {(props) => showVisitorForm(props)}
      </Formik>
    </div>
  );
};

const companys = [
  {
    ID: 1,
    CCCONO: 10,
    CCDIVI: "101",
    CCCONM: "บริษัท บางกอกแร้นช์ จำกัด (มหาชน) ",
    COMPANY: '"10 : 101 : บริษัท บางกอกแร้นช์ จำกัด (มหาชน)"',
  },
  {
    ID: 2,
    CCCONO: 100,
    CCDIVI: "110",
    CCCONM: "บริษัท อนาทิส ฟู๊ดส์ จำกัด ",
    COMPANY: '"100 : 110 : บริษัท อนาทิส ฟู๊ดส์ จำกัด"',
  },
  {
    ID: 3,
    CCCONO: 100,
    CCDIVI: "120",
    CCCONM: "ANATIS FOODS LIMITED (HK) ",
    COMPANY: '"100 : 120 : ANATIS FOODS LIMITED (HK)"',
  },
  {
    ID: 4,
    CCCONO: 100,
    CCDIVI: "130",
    CCCONM: "ANATIS FOODS LIMITED (SG) ",
    COMPANY: '"100 : 130 : ANATIS FOODS LIMITED (SG)"',
  },
  {
    ID: 5,
    CCCONO: 200,
    CCDIVI: "200",
    CCCONM: "บริษัท บีอาร์ การเกษตร จำกัด ",
    COMPANY: '"200 : 200 : บริษัท บีอาร์ การเกษตร จำกัด"',
  },
  {
    ID: 6,
    CCCONO: 300,
    CCDIVI: "300",
    CCCONM: "บริษัท บีเอ็ม การเกษตร จำกัด ",
    COMPANY: '"300 : 300 : บริษัท บีเอ็ม การเกษตร จำกัด"',
  },
  {
    ID: 7,
    CCCONO: 400,
    CCDIVI: "400",
    CCCONM: "บริษัท ฟู้ด ซิตี้ จำกัด ",
    COMPANY: '"400 : 400 : บริษัท ฟู้ด ซิตี้ จำกัด"',
  },
  {
    ID: 8,
    CCCONO: 500,
    CCDIVI: "500",
    CCCONM: "บริษัท เอ็นเอส เดลิคาเทสเซน จำกัด ",
    COMPANY: '"500 : 500 : บริษัท เอ็นเอส เดลิคาเทสเซน จำกัด"',
  },
  {
    ID: 9,
    CCCONO: 600,
    CCDIVI: "600",
    CCCONM: "บริษัท วินไทย ฟู้ด จำกัด ",
    COMPANY: '"600 : 600 : บริษัท วินไทย ฟู้ด จำกัด"',
  },
];

export default FilePage;
