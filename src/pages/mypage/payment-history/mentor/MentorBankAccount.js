// MentorBankAccount.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const accountContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px'
};

const inputContainerStyle = {
  position: 'relative'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9fafb'
};

const changeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#3b82f6',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer'
};

const noteStyle = {
  fontSize: '14px',
  color: '#666',
  marginTop: '8px'
};

const MentorBankAccount = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [completeSettlements, setCompleteSettlements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const token = localStorage.getItem("jwtToken");

      const fetchAccount = async () => {
          if (!token) {
              setError("로그인이 필요합니다.");
              setLoading(false);
              return;
          }

          try {
              const response = await api.get("/users/account", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              setAccount(response.data.data.account);


              //여태 정산된 내역 총합 요청
              const completeResponse = await api.get("/mentors/mentoring/payment-history/settles-complete",{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setCompleteSettlements(completeResponse.data.data);
                
          } catch (error) {
              setError("계좌 정보를 불러오는 중 오류가 발생했습니다.");
          } finally {
              setLoading(false);
          }
      };

      useEffect(() => {
      fetchAccount();
  }, [token]);

  const handleUpdateAccount = async () => {
    if (!bankName || !bankAccount) {
      alert("은행명과 계좌번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await api.patch("/users/bank-account",
        {
          bankName: bankName,
          bankAccount: bankAccount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      
      alert("계좌 정보가 수정되었습니다.");
      setShowModal(false);
      // 계좌 정보 다시 불러오기
      await fetchAccount();
    } catch (error) {
      alert(error.response?.data?.message || "계좌 정보 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Modal 스타일
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px'
  };

  const modalInputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const modalButtonStyle = {
    padding: '8px 16px',
    marginRight: '10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={accountContainerStyle}>
      <h2 style={titleStyle}>정산 계좌 관리</h2>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={account}
          readOnly
          style={inputStyle}
        />
        <button 
          style={changeButtonStyle}
          onClick={() => setShowModal(true)}
        >
          변경
        </button>
      </div>
      <p style={noteStyle}>
        * 정산받으실 계좌를 등록/변경할 수 있습니다.
      </p>
      <p>총 정산된 건수: {completeSettlements.count}</p>
      <p>총 정산된 금액: {completeSettlements.finalCost}</p>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{marginBottom: '15px'}}>계좌 정보 변경</h3>
            <input
              style={modalInputStyle}
              type="text"
              placeholder="은행명"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <input
              style={modalInputStyle}
              type="text"
              placeholder="계좌번호"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
            <div style={{textAlign: 'right', marginTop: '15px'}}>
              <button 
                style={{...modalButtonStyle, backgroundColor: '#3b82f6', color: 'white'}}
                onClick={handleUpdateAccount}
              >
                변경
              </button>
              <button 
                style={{...modalButtonStyle, backgroundColor: '#e5e7eb'}}
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorBankAccount;