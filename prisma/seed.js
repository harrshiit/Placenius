import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ======  Industries Seed Data  ======
  await prisma.industry.createMany({
    data: [
      { name: "Software Development", slug: "software" },
      { name: "Data Science", slug: "data-science" },
      { name: "Cyber Security", slug: "cyber-security" },
      { name: "AI & Machine Learning", slug: "ai-ml" },
      { name: "Cloud Computing", slug: "cloud" },
    ],
    skipDuplicates: true,
  });

  // ======  Quizzes Seed Data  ======
  await prisma.quiz.createMany({
    data: [
      { industrySlug: "software", question: "What is OOP?", answer: "…" },
      { industrySlug: "data-science", question: "What is Overfitting?", answer: "…" },
      { industrySlug: "ai-ml", question: "Define Gradient Descent", answer: "…" },
    ],
    skipDuplicates: true,
  });

  // ======  Resume Tips Seed Data ======
  await prisma.resumeTip.createMany({
    data: [
      { title: "Use action verbs", description: "Start bullet points with action words…" },
      { title: "Keep resume one page", description: "Unless senior-level…" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("🌱 Database seeded successfully!");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
