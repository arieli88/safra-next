import styles from '../styles/section.module.css';


export default function Community() {
return (
<section id="community" className={styles.section}>
<h2>הצטרפו לקהילה שלנו</h2>
<div className={styles.grid}>
<div className={styles.card}>
<h3>שיעורי ספרא</h3>
<p>לימוד תורני עמוק | ימי ראשון ורביעי</p>
</div>
<div className={styles.card}>
<h3>משב רוח</h3>
<p>פילוסופיה יהודית עכשווית | ימי שני</p>
</div>
</div>
</section>
);
}