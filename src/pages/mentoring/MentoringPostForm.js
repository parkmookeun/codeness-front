import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory, useLocation } from "react-router-dom";
import "../../styles/mentoring/MentoringPostForm.css";
import api from "../../api/axios";

const MentoringPostForm = () => {
  const { handleSubmit, control, register, formState: { errors } } = useForm();
  const history = useHistory();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      window.history.replaceState({}, document.title, "/mentoring");
    }

    const savedToken = localStorage.getItem("jwtToken");
    if (!savedToken) {
      history.push("/login");
    } else {
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, [location, history]);

  const validateDates = (startDate, endDate) => {
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage("종료 날짜는 시작 날짜 이후여야 합니다.");
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateDates(data.startDate, data.endDate)) {
      return;
    }

    const fieldMap = {
      "Back-End": "BACKEND",
      "Front-End": "FRONTEND",
      "Game": "Game",
      "AI":"AI",
      "Server-Infra":"SERVER_INFRA",
      "Network-Security":"NETWORK_SECURITY",
      "Embedded-Systems":"EMBEDDED_SYSTEMS"
    };

    const requestData = {
      title: data.title,
      company: data.company,
      field: fieldMap[data.field],
      career: parseInt(data.career, 10),
      region: data.region,
      price: parseFloat(data.price).toFixed(2),
      startDate: data.startDate.toISOString().split("T")[0],
      endDate: data.endDate.toISOString().split("T")[0],
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
    };

    try {
      const response = await api.post("/mentoring", requestData);
      setModalMessage(response.data.msg);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setModalMessage("멘토링 공고 생성에 실패했습니다.");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const gotoMentoringMain = () => {
    history.push("/mentoring");
  };

  return (
      <div className="container">
        <h2>멘토 공고 올리기</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>제목</label>
            <input
                {...register("title", {
                  required: "제목은 필수 입력 값입니다.",
                  maxLength: {
                    value: 30,
                    message: "공고 제목은 30자 이내로 작성해주세요.",
                  },
                })}
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>회사명</label>
            <input
                {...register("company", {
                  required: "회사명은 필수 입력 값입니다.",
                  maxLength: {
                    value: 20,
                    message: "회사 이름은 20자 이내로 작성해주세요.",
                  },
                })}
                placeholder="예) 스파르타"
            />
            {errors.company && <span className="error-message">{errors.company.message}</span>}
          </div>

          <div className="form-group">
            <label>분야</label>
            <select {...register("field", {required: "분야를 선택해주세요."})}>
              <option value="Back-End">Back-End</option>
              <option value="Front-End">Front-End</option>
              <option value="Game">Game</option>
              <option value="AI">AI</option>
              <option value="Server-Infra">Server-Infra</option>
              <option value="Network-Security">Network-Security</option>
              <option value="Embedded-Systems">Embedded-Systems</option>
            </select>
            {errors.field && <span className="error-message">{errors.field.message}</span>}
          </div>

          <div className="form-group">
            <label>경력 (년)</label>
            <input
                type="text"
                {...register("career", {
                  required: "경력은 필수 입력 값입니다.",
                  validate: (value) => /^\d+$/.test(value) || "경력은 숫자만 입력 가능합니다.",
                  max: {
                    value: 70,
                    message: "경력은 최대 70년까지 입력 가능합니다.",
                  },
                })}
                placeholder="5"
            />
            {errors.career && <span className="error-message">{errors.career.message}</span>}
          </div>

          <div className="form-group">
            <label>지역</label>
            <input
                {...register("region", {
                  required: "지역은 필수 입력 값입니다.",
                  maxLength: {
                    value: 30,
                    message: "지역은 30자 이내로 작성해주세요.",
                  },
                })}
                placeholder="예) 서울권, 경기도"
            />
            {errors.region && <span className="error-message">{errors.region.message}</span>}
          </div>

          <div className="form-group">
            <label>시간당 멘토링 가격 (원)</label>
            <input
                type="text"
                {...register("price", {
                  required: "가격은 필수 입력 값입니다.",
                  validate: (value) => /^\d+$/.test(value) || "가격은 숫자만 입력 가능합니다.",
                  min: {
                    value: 1000,
                    message: "시간당 최소 가격은 1,000원입니다.",
                  },
                  max: {
                    value: 100000,
                    message: "시간당 최대 가격은 100,000원입니다.",
                  },
                })}
                placeholder="예) 15000"
            />
            {errors.price && <span className="error-message">{errors.price.message}</span>}
          </div>

          <div className="form-group">
            <label>시작 날짜</label>
            <Controller
                name="startDate"
                control={control}
                rules={{ required: "시작 날짜를 선택해주세요." }}
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                    />
                )}
            />
            {errors.startDate && <span className="error-message">{errors.startDate.message}</span>}
          </div>

          <div className="form-group">
            <label>종료 날짜</label>
            <Controller
                name="endDate"
                control={control}
                rules={{ required: "종료 날짜를 선택해주세요." }}
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                    />
                )}
            />
            {errors.endDate && <span className="error-message">{errors.endDate.message}</span>}
          </div>

          <div className="form-group">
            <label>시작 시간</label>
            <Controller
                name="startTime"
                control={control}
                defaultValue="00:00"
                rules={{ required: "시작 시간을 선택해주세요." }}
                render={({ field }) => (
                    <select {...field}>
                      {Array.from({ length: 24 }, (_, i) => {
                        const now = new Date();
                        const currentHour = now.getHours();
                        return (
                            <option
                                key={i}
                                value={`${String(i).padStart(2, "0")}:00`}
                            >
                              {`${String(i).padStart(2, "0")}:00`}
                            </option>
                        );
                      })}
                    </select>
                )}
            />
            {errors.startTime && <span className="error-message">{errors.startTime.message}</span>}
          </div>

          <div className="form-group">
            <label>종료 시간</label>
            <Controller
                name="endTime"
                control={control}
                defaultValue="00:00"
                rules={{ required: "종료 시간을 선택해주세요." }}
                render={({ field }) => (
                    <select {...field}>
                      {Array.from({ length: 24 }, (_, i) => {
                        const now = new Date();
                        const currentHour = now.getHours();
                        return (
                            <option
                                key={i}
                                value={`${String(i).padStart(2, "0")}:00`}
                            >
                              {`${String(i).padStart(2, "0")}:00`}
                            </option>
                        );
                      })}
                    </select>
                )}
            />
            {errors.endTime && <span className="error-message">{errors.endTime.message}</span>}
          </div>

          <div className="form-group">
            <label>설명글</label>
            <textarea
                {...register("description", {
                  required: "설명글은 필수 입력 값입니다.",
                  maxLength: {
                    value: 300,
                    message: "설명글은 최대 300자까지 작성 가능합니다.",
                  },
                })}
                placeholder="설명글을 입력해주세요."
            />
            {errors.description && <span className="error-message">{errors.description.message}</span>}
          </div>

          <button type="submit" onClick={gotoMentoringMain}>작성하기</button>
        </form>
        <style jsx>{`
          .container {
            width: 50%;
            margin: 50px auto;
            padding: 30px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h2 {
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: bold;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          label {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
          }
          .error-message {
            color: red;
            font-size: 12px;
            margin-top: 5px;
          }
          button {
            width: 100%;
            padding: 12px;
            background-color: #82b1ff;
            border: none;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          }
          button:hover {
            background-color: #448aff;
          }
        `}</style>
      </div>
  );
};

export default MentoringPostForm;
