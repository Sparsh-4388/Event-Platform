import "../App.css";

export default function OverlayLoader({ text = "Loading..."}) {
    return(
        <div className="overlay-loader">
            <div className="loader-card">
                <div className="spinner" />
                <p>{text}</p>
            </div>
        </div>
    )
}