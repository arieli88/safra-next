import styles from '../styles/section.module.css';


export default function History() {
return (
<section id="history" className={styles.section}>
<h2>היסטוריית המקום</h2>
<p>
בית מדרש ספרא הוקם בשנת 2018 מתוך רצון לתת לחיילים ולחיילות מקום מפלט
מהשגרה הצבאית.
</p>
<img src="/images/REPORT.jpg" alt="היסטוריה" className={styles.historyImg} />
</section>
);
}