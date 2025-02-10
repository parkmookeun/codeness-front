import React, {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useHistory, useLocation} from "react-router-dom";
import "../../styles/mentoring/MentoringPostForm.css";
import api from "../../api/axios";

const MentoringPostForm = () => {
  const {handleSubmit, control, register, formState: {errors}} = useForm();
  const history = useHistory();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fieldOptions = [
    { value: "BACKEND", label: "백엔드" },
    { value: "FRONTEND", label: "프론트엔드" },
    { value: "GAME", label: "게임" },
    { value: "AI", label: "인공지능" },
    { value: "SERVER_INFRA", label: "서버-인프라" },
    { value: "NETWORK_SECURITY", label: "네트워크-보안" },
    { value: "EMBEDDED_SYSTEMS", label: "임베디드" },
  ];

  const fieldMap = {
    BACKEND: "BACKEND",
    FRONTEND: "FRONTEND",
    GAME: "GAME",
    AI: "AI",
    SERVER_INFRA: "SERVER_INFRA",
    NETWORK_SECURITY: "NETWORK_SECURITY",
    EMBEDDED_SYSTEMS: "EMBEDDED_SYSTEMS"
  };

  const formatDateToLocal = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

    console.log("🛠 요청되는 데이터:", data);

    const mappedField = fieldMap[data.field] || "BACKEND"; // ✅ undefined 방지
    console.log("🚀 field 값 확인:", data.field, "매핑된 값:", mappedField);

    const requestData = {
      title: data.title,
      company: data.company,
      field: mappedField,
      career: parseInt(data.career, 10),
      region: data.region,
      price: parseFloat(data.price).toFixed(2),
      startDate: formatDateToLocal(data.startDate),
      endDate: formatDateToLocal(data.endDate),
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
    };

    console.log("🚀 최종 요청 데이터:", requestData);

    try {
      const response = await api.post("/mentoring", requestData);
      setModalMessage(response.data.msg);
      setShowModal(true);
      history.push("/mentoring");
    } catch (error) {
      console.error("❌ API 요청 실패:", error);
      setModalMessage("멘토링 공고 생성에 실패했습니다.");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
      <div className="container-post">
        <div className="mentoring-post">
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
                  placeholder="30자 이내로 제목을 입력해주세요."
              />
              {errors.title && <span
                  className="error-message">{errors.title.message}</span>}
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
                  placeholder="20자 이내로 회사명을 입력해주세요."
              />
              {errors.company && <span
                  className="error-message">{errors.company.message}</span>}
            </div>
            <div className="form-group">
              <label>분야</label>
              <select {...register("field", {required: "분야를 선택해주세요."})}>
                <option value="">분야를 선택해주세요</option>
                {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                ))}
              </select>
              {errors.field && <span
                  className="error-message">{errors.field.message}</span>}
            </div>
            <div className="form-group">
              <label>경력(년)</label>
              <input
                  type="text"
                  {...register("career", {
                    required: "경력은 필수 입력 값입니다.",
                    validate: (value) => /^\d+$/.test(value)
                        || "경력은 숫자만 입력 가능합니다.",
                    max: {
                      value: 70,
                      message: "경력은 최대 70년까지 입력 가능합니다.",
                    },
                  })}
                  placeholder="경력은 숫자만 입력해주세요."
              />
              {errors.career && <span
                  className="error-message">{errors.career.message}</span>}
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
                  placeholder="예) 서울, 경기"
              />
              {errors.region && <span
                  className="error-message">{errors.region.message}</span>}
            </div>
            <div className="form-group">
              <label>시간당 멘토링 가격 (원)</label>
              <input
                  type="text"
                  {...register("price", {
                    required: "가격은 필수 입력 값입니다.",
                    validate: (value) => /^\d+$/.test(value)
                        || "가격은 숫자만 입력 가능합니다.",
                    min: {
                      value: 1000,
                      message: "시간당 최소 가격은 1,000원입니다.",
                    },
                    max: {
                      value: 100000,
                      message: "시간당 최대 가격은 100,000원입니다.",
                    },
                  })}
                  placeholder="가격은 최소 1000 이상의 숫자만 입력해주세요."
              />
              {errors.price && <span
                  className="error-message">{errors.price.message}</span>}
            </div>
            <span className="form-notice">📢 현재 날짜와 시간에 맞게 입력해주세요.</span>
            <div className="form-group">
              <label>시작 날짜</label>
              <Controller
                  name="startDate"
                  control={control}
                  rules={{required: "시작 날짜를 선택해주세요."}}
                  render={({field}) => (
                      <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                      />
                  )}
              />
              {errors.startDate && <span
                  className="error-message">{errors.startDate.message}</span>}
            </div>
            <div className="form-group">
              <label>종료 날짜</label>
              <Controller
                  name="endDate"
                  control={control}
                  rules={{required: "종료 날짜를 선택해주세요."}}
                  render={({field}) => (
                      <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                      />
                  )}
              />
              {errors.endDate && <span
                  className="error-message">{errors.endDate.message}</span>}
            </div>
            <div className="form-group">
              <label>시작 시간</label>
              <Controller
                  name="startTime"
                  control={control}
                  defaultValue="01:00"
                  rules={{required: "시작 시간을 선택해주세요."}}
                  render={({field}) => (
                      <select {...field}>
                        {Array.from({length: 23}, (_, i) => {
                          const hour = i + 1; // 01:00부터 시작
                          return (
                              <option key={hour}
                                      value={`${String(hour).padStart(2,
                                          "0")}:00`}>
                                {`${String(hour).padStart(2, "0")}:00`}
                              </option>
                          );
                        })}
                      </select>
                  )}
              />
              {errors.startTime && <span
                  className="error-message">{errors.startTime.message}</span>}
            </div>

            <div className="form-group">
              <label>종료 시간</label>
              <Controller
                  name="endTime"
                  control={control}
                  defaultValue="01:00"
                  rules={{required: "종료 시간을 선택해주세요."}}
                  render={({field}) => (
                      <select {...field}>
                        {Array.from({length: 23}, (_, i) => {
                          const hour = i + 1; // 01:00부터 시작
                          return (
                              <option key={hour}
                                      value={`${String(hour).padStart(2,
                                          "0")}:00`}>
                                {`${String(hour).padStart(2, "0")}:00`}
                              </option>
                          );
                        })}
                      </select>
                  )}
              />
              {errors.endTime && <span
                  className="error-message">{errors.endTime.message}</span>}
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
              {errors.description && <span
                  className="error-message">{errors.description.message}</span>}
            </div>
            <button type="submit">작성하기</button>
          </form>
        </div>
      </div>
  );
};
export default MentoringPostForm;
