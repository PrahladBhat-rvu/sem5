import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-logo">
          <strong>fitness</strong>
          <span>BLENDER</span>
        </div>


        <div className="footer-columns">

          <div>
            <h4>{t.footer.workouts}</h4>

            <p>{t.footer.workoutVideos}</p>
            <p>{t.footer.customWorkouts}</p>
            <p>{t.footer.programs}</p>
            <p>{t.footer.workoutPrograms}</p>
            <p>{t.footer.mealPlans}</p>
          </div>


          <div>
            <h4>{t.footer.healthyLiving}</h4>

            <p>{t.footer.fitness}</p>
            <p>{t.footer.health}</p>
            <p>{t.footer.nutrition}</p>
            <p>{t.footer.healthyRecipes}</p>
            <p>{t.footer.experts}</p>
          </div>


          <div>
            <h4>{t.footer.about}</h4>

            <p>{t.footer.careers}</p>
            <p>{t.footer.tutorials}</p>
            <p>{t.footer.ourTeam}</p>
            <p>{t.footer.b2b}</p>
          </div>


          <div>
            <h4>{t.footer.membership}</h4>

            <p>{t.footer.plus}</p>
            <p>{t.footer.community}</p>
            <p>{t.footer.referral}</p>
            <p>{t.footer.blog}</p>
            <p>{t.footer.contact}</p>
            <p>{t.footer.faq}</p>
            <p>{t.footer.store}</p>
          </div>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          {t.footer.copyright}
        </span>

        <span>
          {t.footer.terms}
        </span>

        <span>
          {t.footer.privacy}
        </span>

      </div>

    </footer>
  );
}

export default Footer;