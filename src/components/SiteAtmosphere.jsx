const particles = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 19) % 86)}%`,
  top: `${10 + ((index * 31) % 82)}%`,
  delay: `${(index % 8) * 0.72}s`,
  duration: `${14 + (index % 7) * 2.4}s`,
}))

const SiteAtmosphere = () => (
  <div className="site-atmosphere" aria-hidden="true">
    <span className="atmosphere-field atmosphere-field-one"></span>
    <span className="atmosphere-field atmosphere-field-two"></span>
    <span className="atmosphere-line atmosphere-line-one"></span>
    <span className="atmosphere-particles">
      {particles.map((particle) => (
        <i
          key={particle.id}
          style={{
            '--particle-left': particle.left,
            '--particle-top': particle.top,
            '--particle-delay': particle.delay,
            '--particle-duration': particle.duration,
          }}
        ></i>
      ))}
    </span>
  </div>
)

export default SiteAtmosphere
