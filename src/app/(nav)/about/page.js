export const metadata = {
    title: 'À propos de nous',
    description: 'Découvrez notre histoire et notre équipe',
  };
  
  export default function AboutPage() {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">À propos de nous</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
          <p className="mb-4">
            Fondée en 2022, notre entreprise a débuté avec une vision simple : 
            créer des produits qui améliorent la vie quotidienne des gens.
          </p>
          <p>
            Aujourd'hui, nous sommes fiers de servir des clients dans plus de 
            10 pays, avec une équipe passionnée de 25 personnes.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
          <p>
            Nous nous engageons à développer des solutions innovantes 
            tout en maintenant les plus hauts standards de qualité et 
            d'éthique dans tout ce que nous faisons.
          </p>
        </section>
      </main>
    );
  }