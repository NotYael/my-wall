import "./Profile.css";
import profilePicture from "../assets/profile-picture.jpg";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import gmailIcon from "../assets/gmail.png";

function Profile() {
  return (
    <div className="profile">
      <img
        className="profile-picture"
        src={profilePicture}
        alt="Profile Picture"
      />
      <h2>Danyael Dela Cruz</h2>
      <p>
        My name is Danyael, but feel free to call me Yael. I am a 5th year
        Computer Science student from the University of the Philippines Diliman.
        I am a full-stack developer with a passion for creating well designed
        and functional applications. I am also a tech and finance enthusiast. I
        love playing video games, watching movies and series, and reading books
        in my spare time. Currently, I am studying to become a Cloud Engineer.
      </p>
      <div className="profile-links">
        <a
          href="https://github.com/danyaeldelacruz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" />
        </a>
        <a
          href="https://linkedin.com/in/danyaeldelacruz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={linkedinIcon} alt="LinkedIn" />
        </a>
        <a
          href="mailto:contactdanyael@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={gmailIcon} alt="Gmail" />
        </a>
      </div>
    </div>
  );
}

export default Profile;
