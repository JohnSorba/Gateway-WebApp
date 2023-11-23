import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";

import { FaChevronDown } from "react-icons/fa";
import {
  articles,
  events,
  latestNews,
  notice,
} from "../Dashboard/DashboardData";
import { MdNotifications } from "react-icons/md";

function NewsSection() {
  const [showShadow, setShowShadow] = useState(false);
  const containerRef = useRef(null);
  const { authState } = useAuth();

  const handleScroll = () => {
    // Logic to add shadow when the scrollable content reaches the sticky header
    const isScrolledToTop = containerRef.current.scrollTop > 0;
    setShowShadow(isScrolledToTop);
  };

  useEffect(() => {
    // Code to run on component mount
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the conponent unmounts
    return () => {
      // Code to run on component unmount
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <aside
      className={`aside ${showShadow ? "shadow" : ""}`}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div className="container">
        <section className="profile ">
          <article className="user flex items-center gap-3 px-4 py-2">
            <img src="https://i.pravatar.cc/48?u=118556" alt="user-profile" />
            <p className="flex flex-col gap-0 justify-center">
              <span className="flex items-center gap-4">
                <span className="text-md">{authState.username}</span>
                <FaChevronDown className="w-4 h-4 text-gray-400" />
              </span>

              <span className="text-sm text-green-700">Active</span>
            </p>
          </article>
          {/* <NavLink to="/dashboard/pupil/profile" className="nav-link profile">
  <FaUserAlt /> Profile
</NavLink>
*/}
          <article>
            <MdNotifications className="w-6 h-6 text-red-400" />
          </article>
        </section>
        <section>
          <h3 className="section-heading">Important Notice</h3>
          <ul className="articles">
            {notice.map((item) => (
              <li key={item.title} className="list-item">
                <img src={item.image} alt="Tech Conference" />
                <div>
                  <h3>{item.title}</h3>
                  <p>By - {item.author}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-heading">Upcoming Events</h3>
          <ul className="events">
            {events.map((item) => (
              <li key={item.title} className="list-item">
                <img src={item.image} alt="Tech Conference" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                  {/* <span>{item.date}</span> */}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-heading">Latest News</h3>
          <ul className="latest-news">
            {latestNews.map((item) => (
              <li key={item.title} className="list-item">
                <img src={item.image} alt="Tech Conference" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.source}</p>
                  <span>{item.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-heading">Articles</h3>
          <ul className="articles">
            {articles.map((item) => (
              <li key={item.title} className="list-item">
                <img src={item.image} alt="Tech Conference" />
                <div>
                  <h3>{item.title}</h3>
                  <p>By - {item.author}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}

export default NewsSection;
