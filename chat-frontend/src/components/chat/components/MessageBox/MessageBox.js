import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "../Message/Message";
// import { paginateMessages } from '../../../../store/actions/chat'
import { paginateMessagesAsync } from "./../../../../features/chat/chatThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MessageBox.scss";
const MessageBox = ({ chat }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.userInfo);
  const scrollBottom = useSelector((state) => state.chat.scrollBottom);
  const senderTyping = useSelector((state) => state.chat.senderTyping);
  const [loading, setLoading] = useState(false);
  const [scrollUp, setScrollUp] = useState(0);

  const msgBox = useRef();

  const scrollManual = (value) => {
    msgBox.current.scrollTop = value;
  };

  const handleInfiniteScroll = (e) => {
    console.log("Scroll");
    // scroll top

    if (e.target.scrollTop === 0) {
      const pagination = chat.Pagination;
      const page = typeof pagination === "undefined" ? 1 : pagination.page;
      if (pagination?.totalPages === +pagination?.page) {
        return;
      }
      setLoading(true);

      dispatch(paginateMessagesAsync({ id: chat.id, page: parseInt(page) + 1 }))
        .then((res) => {
          if (res) {
            setScrollUp(scrollUp + 1);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollManual(Math.ceil(msgBox.current.scrollHeight * 0.1));
    }, 100);
  }, [scrollUp]);

  // useEffect(() => {
  //     if (senderTyping.typing && msgBox.current.scrollTop > msgBox.current.scrollHeight * 0.30) {
  //         setTimeout(() => {
  //             scrollManual(msgBox.current.scrollHeight)
  //         }, 100)
  //     }
  // }, [senderTyping])

  useEffect(() => {
    // if (!senderTyping.typing) {
    //     setTimeout(() => {
    //         scrollManual(msgBox.current.scrollHeight)
    //     }, 100)
    // }
    // setTimeout(() => {

    // }, 100);
    scrollManual(msgBox.current.scrollHeight);
  }, [scrollBottom]);

  return (
    <div id="msg-box" ref={msgBox} onScroll={handleInfiniteScroll}>
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : null}
      {chat.Messages.map((message, index) => {
        return (
          <Message
            user={user}
            chat={chat}
            message={message}
            index={index}
            key={message.id}
          />
        );
      })}
      {senderTyping.typing && senderTyping.chatId === chat.id ? (
        <div className="message mt-5p">
          <div className="other-person">
            <p className="m-0">
              {senderTyping.fromUser.firstName} {senderTyping.fromUser.lastName}
              ...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MessageBox;
