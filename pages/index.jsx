import Logo from "../components/Utils";
import styles from "../css/Index.module.css";

export default function Index() {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div id={styles["title-text"]}>TheTutor4U</div>
                <Logo className="col" />
            </div>
        </div>
    );
}
