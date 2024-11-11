// 수정모드 진입 전에 비번 확인하기

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Password() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // URL에서 mode 가져오기
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState('');

  /* 서버에서 이름 가져오기 (수정할 게시글의 데이터) */
  useEffect(() => {
    const fetchName = async () => {
      try {
        // 게시글 ID, 작성자 이름을 가져오기
        const resp = await axios.get(`http://127.0.0.1:8001/board/${id}`);
        setName(resp.data.name);
        // 서버에서 받은 유저이름 state에 저장
        // data는 axios가 서버 응답에서 생성하는 속성
      } catch (error) {
        setErrorMessage('이름을 가져올 수 없습니다.');
      }
    };
    fetchName();
  }, [id]); // id가 변경될 때마다 새로 요청 보내기

  /* URL에서 모드 가져오기 (수정, 삭제) */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setMode(searchParams.get('mode'));
  }, [location]);

  /* 비밀번호 검증, 페이지 이동 */
  const handleSubmit = async () => {
    // 비밀번호 입력 여부 확인
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요!');
      return;
    }

    // 비밀번호 길이와 유형 확인
    if (password.length < 8 || password.length > 12 || !/\d/.test(password)) {
      setErrorMessage('비밀번호는 8~12자이며 숫자를 포함해야 합니다!');
      return;
    }

    console.log('비밀번호 전송:', password, typeof password);

    try {
      const resp = await axios.post('http://127.0.0.1:8001/verify_pw', {
        password: password,
        post_id: id,
        // 비밀번호와 게시글 ID를 서버에 전송
      });

      if (resp.data.success) {
        if (mode === 'edit') {
          navigate(`/edit/${id}`);
        } else if (mode === 'delete') {
          await axios.delete(`http://127.0.0.1:8001/board/${id}`, {
            data: { password: password }, // 비밀번호 함께 전송
          });
          alert('게시글 삭제 성공!🙌');
          navigate('/board');
        }
      } else {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setErrorMessage('서버 요청에 실패했습니다.');
    }
  };

  /* 입력창 글자수 제한 핸들러 함수 */
  const handleChange = (e) => {
    const newPassword = e.target.value;
    if (newPassword.length <= 12) {
      setPassword(newPassword);
    }
  };

  return (
    <div className="pw-wrap">
      <div className="pw-title">
        {mode === 'edit'
          ? '비밀번호 확인 (글 수정)'
          : '비밀번호 확인 (글 삭제)'}
      </div>
      <table className="pw-table">
        <tbody>
          <tr>
            <th className="pw-key">이름</th>
            <td className="pw-value">{name}</td>
          </tr>
          <tr>
            <th className="pw-key">비밀번호</th>
            <td className="pw-value">
              <input
                className="pw-input"
                type="password"
                value={password}
                onChange={handleChange}
              />
              <div className="char-count">
                {password.length}/12
                {/* 입력제한 12자 이하 */}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {errorMessage && <div className="error-msg">{errorMessage}</div>}
      <div className="submit">
        <button className="pw-btn" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}
