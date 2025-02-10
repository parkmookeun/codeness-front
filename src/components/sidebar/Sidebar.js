const fieldMapping = {
  "전체" : "",
  "백엔드": "BACKEND",
  "프론트엔드": "FRONTEND",
  "게임": "GAME",
  "인공지능": "AI",
  "서버 / 인프라": "SERVER_INFRA",
  "네트워크 / 보안": "NETWORK_SECURITY",
  "임베디드": "EMBEDDED_SYSTEMS",
};

const Sidebar = ({ selectedField, setSelectedField }) => {
  const fields = Object.keys(fieldMapping); // 한글 필드 목록

  return (
      <div className="sidebar">
        <h3>분야</h3>
        <ul>
          {fields.map((field) => (
              <li
                  key={field}
                  className={selectedField === fieldMapping[field] ? "active" : ""}
                  onClick={() => {
                    console.log("선택한 필드 (한글):", field);
                    console.log("변환된 필드 (ENUM):", fieldMapping[field]);

                    if (field === "전체") {
                      // ✅ 전체 선택 시 검색어 및 상태 초기화 후 새로고침
                      window.location.reload();
                    } else {
                      setSelectedField(fieldMapping[field]); // ENUM 값으로 설정
                    }
                  }}
              >
                {field}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default Sidebar;

