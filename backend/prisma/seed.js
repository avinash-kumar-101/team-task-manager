const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@teamtask.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('  ✅ Admin user created: admin@teamtask.com / Admin@123');

  // Create Member user
  const memberPassword = await bcrypt.hash('Member@123', 10);
  const member = await prisma.user.create({
    data: {
      name: 'Member User',
      email: 'member@teamtask.com',
      passwordHash: memberPassword,
      role: 'member',
    },
  });
  console.log('  ✅ Member user created: member@teamtask.com / Member@123');

  // Create a second member
  const member2Password = await bcrypt.hash('Member@123', 10);
  const member2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@teamtask.com',
      passwordHash: member2Password,
      role: 'member',
    },
  });
  console.log('  ✅ Member user created: jane@teamtask.com / Member@123');

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      description: 'Build a modern e-commerce platform with React frontend and Node.js backend. Includes payment integration, product catalog, and user management.',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Redesign',
      description: 'Complete redesign of the mobile app focusing on UX improvements, accessibility, and performance optimization.',
      ownerId: admin.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'API Gateway Migration',
      description: 'Migrate existing REST APIs to a new API gateway with rate limiting, caching, and monitoring capabilities.',
      ownerId: admin.id,
    },
  });

  console.log('  ✅ 3 projects created');

  // Add members to projects
  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin.id, role: 'admin' },
      { projectId: project1.id, userId: member.id, role: 'member' },
      { projectId: project1.id, userId: member2.id, role: 'member' },
      { projectId: project2.id, userId: admin.id, role: 'admin' },
      { projectId: project2.id, userId: member.id, role: 'member' },
      { projectId: project3.id, userId: admin.id, role: 'admin' },
      { projectId: project3.id, userId: member2.id, role: 'member' },
    ],
  });
  console.log('  ✅ Project members assigned');

  // Create Tasks
  const now = new Date();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now); twoDaysAgo.setDate(now.getDate() - 2);
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7);
  const inTwoWeeks = new Date(now); inTwoWeeks.setDate(now.getDate() + 14);

  const tasks = await prisma.task.createMany({
    data: [
      // Project 1 tasks
      { projectId: project1.id, title: 'Setup project repository', description: 'Initialize Git repo, setup CI/CD pipeline, and configure linting rules.', status: 'done', priority: 'high', dueDate: twoDaysAgo, assigneeId: member.id, createdBy: admin.id },
      { projectId: project1.id, title: 'Design database schema', description: 'Create ER diagram and define all database tables with relationships.', status: 'done', priority: 'high', dueDate: yesterday, assigneeId: admin.id, createdBy: admin.id },
      { projectId: project1.id, title: 'Implement authentication', description: 'Build JWT-based auth with signup, login, and token refresh.', status: 'in_progress', priority: 'high', dueDate: tomorrow, assigneeId: member.id, createdBy: admin.id },
      { projectId: project1.id, title: 'Product catalog API', description: 'CRUD endpoints for products with search and filtering.', status: 'todo', priority: 'medium', dueDate: nextWeek, assigneeId: member2.id, createdBy: admin.id },
      { projectId: project1.id, title: 'Shopping cart frontend', description: 'React components for cart management with local storage persistence.', status: 'todo', priority: 'medium', dueDate: inTwoWeeks, assigneeId: member.id, createdBy: admin.id },
      { projectId: project1.id, title: 'Payment integration', description: 'Integrate Stripe for payment processing with webhooks.', status: 'todo', priority: 'high', dueDate: inTwoWeeks, assigneeId: null, createdBy: admin.id },
      { projectId: project1.id, title: 'Write unit tests', description: 'Achieve 80% code coverage with Jest and React Testing Library.', status: 'todo', priority: 'low', dueDate: null, assigneeId: member2.id, createdBy: admin.id },

      // Project 2 tasks
      { projectId: project2.id, title: 'User research interviews', description: 'Conduct 10 user interviews to identify pain points.', status: 'done', priority: 'high', dueDate: twoDaysAgo, assigneeId: member.id, createdBy: admin.id },
      { projectId: project2.id, title: 'Create wireframes', description: 'Low-fidelity wireframes for all main screens using Figma.', status: 'in_progress', priority: 'high', dueDate: yesterday, assigneeId: member.id, createdBy: admin.id },
      { projectId: project2.id, title: 'Design system setup', description: 'Define colors, typography, spacing, and component library.', status: 'todo', priority: 'medium', dueDate: tomorrow, assigneeId: admin.id, createdBy: admin.id },
      { projectId: project2.id, title: 'Accessibility audit', description: 'Review all screens for WCAG AA compliance.', status: 'todo', priority: 'high', dueDate: nextWeek, assigneeId: null, createdBy: admin.id },
      { projectId: project2.id, title: 'Performance benchmarking', description: 'Measure and document current app performance metrics.', status: 'todo', priority: 'low', dueDate: nextWeek, assigneeId: member.id, createdBy: admin.id },

      // Project 3 tasks
      { projectId: project3.id, title: 'Evaluate API gateway solutions', description: 'Compare Kong, AWS API Gateway, and custom solutions.', status: 'done', priority: 'high', dueDate: twoDaysAgo, assigneeId: admin.id, createdBy: admin.id },
      { projectId: project3.id, title: 'Migration plan document', description: 'Detail step-by-step migration plan with rollback strategies.', status: 'in_progress', priority: 'high', dueDate: yesterday, assigneeId: member2.id, createdBy: admin.id },
      { projectId: project3.id, title: 'Setup staging environment', description: 'Provision staging infra for gateway testing.', status: 'todo', priority: 'medium', dueDate: nextWeek, assigneeId: member2.id, createdBy: admin.id },
      { projectId: project3.id, title: 'Rate limiting config', description: 'Configure rate limiting rules per endpoint and per user tier.', status: 'todo', priority: 'high', dueDate: inTwoWeeks, assigneeId: null, createdBy: admin.id },
    ],
  });

  console.log('  ✅ 16 tasks created across 3 projects');

  console.log('\n🎉 Seeding complete!\n');
  console.log('┌──────────────────────────────────────────┐');
  console.log('│  Demo Accounts                           │');
  console.log('├──────────────────────────────────────────┤');
  console.log('│  Admin:  admin@teamtask.com / Admin@123  │');
  console.log('│  Member: member@teamtask.com / Member@123│');
  console.log('│  Member: jane@teamtask.com / Member@123  │');
  console.log('└──────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
