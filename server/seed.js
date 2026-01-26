// seed.js - Populate database with sample data for testing
const { createDb } = require('./db');

async function seed() {
  console.log('🌱 Starting database seed...');
  const db = await createDb();

  try {
    // Create sample users
    console.log('Creating users...');

    // Admin user
    const adminId = db.createUser({
      name: 'Campus Admin',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      adminId: 'ADM001',
      college: 'SVKM IOT',
      department: 'Administration'
    });
    console.log(`✅ Created admin user: Campus Admin (ID: ${adminId})`);

    // Student user
    const student1Id = db.createUser({
      name: 'Raj Patil',
      email: 'raj@gmail.com',
      password: 'raj123',
      role: 'student',
      studentId: 'STU123456',
      college: 'SVKM IOT',
      year: '3rd Year',
      department: 'Computer Science',
      skills: 'JavaScript, Python, React'
    });
    console.log(`✅ Created student user: Raj Patil (ID: ${student1Id})`);

    // Create sample events
    console.log('\nCreating events...');
    const event1Id = db.createEvent({
      title: 'Tech Symposium 2024',
      description: 'Annual technology conference featuring industry leaders',
      date: '2024-12-15 10:00:00',
      location: 'Main Auditorium',
      category: 'Technical',
      college: 'SVKM IOT',
      image: 'https://source.unsplash.com/800x600/?technology,conference'
    }, adminId);
    console.log(`✅ Created event: Tech Symposium (ID: ${event1Id})`);

    const event2Id = db.createEvent({
      title: 'Hackathon 2024',
      description: '48-hour coding marathon with exciting prizes',
      date: '2024-12-20 09:00:00',
      location: 'Computer Lab A',
      category: 'Technical',
      college: 'SVKM IOT',
      image: 'https://source.unsplash.com/800x600/?hackathon,coding'
    }, adminId);
    console.log(`✅ Created event: Hackathon (ID: ${event2Id})`);

    // Create sample clubs
    console.log('\nCreating clubs...');
    const club1Id = db.createClub({
      name: 'Coding Club',
      description: 'A community for programming enthusiasts',
      category: 'Technology',
      members_count: 45,
      image: 'https://source.unsplash.com/400x300/?programming'
    });
    console.log(`✅ Created club: Coding Club (ID: ${club1Id})`);

    const club2Id = db.createClub({
      name: 'AI Research Group',
      description: 'Exploring artificial intelligence and machine learning',
      category: 'Research',
      members_count: 30,
      image: 'https://source.unsplash.com/400x300/?artificial intelligence'
    });
    console.log(`✅ Created club: AI Research Group (ID: ${club2Id})`);

    // Create event registrations
    console.log('\nCreating event registrations...');
    const reg1Id = db.registerForEvent(event1Id, {
      userId: student1Id,
      fullName: 'Raj Patil',
      email: 'raj@gmail.com',
      contact: '9876543210',
      collegeName: 'Mumbai University',
      year: '3rd Year',
      department: 'Computer Science',
      studentId: 'STU001'
    });
    console.log(`✅ Raj registered for Tech Symposium (ID: ${reg1Id})`);

    const reg2Id = db.registerForEvent(event2Id, {
      userId: student1Id,
      fullName: 'Raj Patil',
      email: 'raj@gmail.com',
      contact: '9876543210',
      collegeName: 'Mumbai University',
      year: '3rd Year',
      department: 'Computer Science',
      studentId: 'STU001'
    });
    console.log(`✅ Raj registered for Hackathon (ID: ${reg2Id})`);

    // Create club applications
    console.log('\nCreating club applications...');
    const app1Id = db.applyToClub(club1Id, student1Id, 'Experienced in web development and want to contribute');
    console.log(`✅ Raj applied to Coding Club (ID: ${app1Id})`);

    // Create achievements
    console.log('\nCreating achievements...');
    const ach1Id = db.createAchievement({
      title: 'Winner - National Coding Championship',
      description: 'First place in national-level programming competition',
      department: 'Computer Science',
      date: '2024-10-15',
      status: 'approved'
    }, student1Id);
    console.log(`✅ Created achievement for Raj (ID: ${ach1Id})`);

    // Create news
    console.log('\nCreating news articles...');
    const news1Id = db.createNews({
      title: 'Campus WiFi Upgrade Complete',
      content: 'The campus-wide WiFi infrastructure has been upgraded to support faster speeds and more concurrent users.',
      category: 'Infrastructure',
      date: '2024-11-01'
    }, adminId);
    console.log(`✅ Created news article (ID: ${news1Id})`);

    const news2Id = db.createNews({
      title: 'New AI Lab Opening Soon',
      content: 'The university is excited to announce the opening of a state-of-the-art AI research laboratory next month.',
      category: 'Academics',
      date: '2024-11-05'
    }, adminId);
    console.log(`✅ Created news article (ID: ${news2Id})`);

    // Create opportunities
    console.log('\nCreating opportunities...');
    const opp1Id = db.createOpportunity({
      title: 'Software Engineer Intern',
      company: 'Google',
      description: 'Summer internship opportunity for CS students',
      type: 'Internship',
      location: 'Mountain View, CA',
      deadline: '2024-12-31'
    }, adminId);
    console.log(`✅ Created opportunity (ID: ${opp1Id})`);

    const opp2Id = db.createOpportunity({
      title: 'Data Scientist - Full Time',
      company: 'Microsoft',
      description: 'Full-time position for graduating students',
      type: 'Full-time',
      location: 'Redmond, WA',
      deadline: '2025-01-15'
    }, adminId);
    console.log(`✅ Created opportunity (ID: ${opp2Id})`);

    console.log('\n✨ Seed completed successfully!');
    console.log('\nTest Credentials:');
    console.log('==================');
    console.log('Admin Login:');
    console.log('  Email: admin@campus.edu');
    console.log('  Password: admin123');
    console.log('\nStudent Login:');
    console.log('  Email: raj@gmail.com');
    console.log('  Password: raj123');
    console.log('\n📝 Summary:');
    console.log(`   Users: 2 (1 admin, 1 student)`);
    console.log(`   Events: 2`);
    console.log(`   Event Registrations: 2`);
    console.log(`   Clubs: 2`);
    console.log(`   Club Applications: 1`);
    console.log(`   Achievements: 1 (approved)`);
    console.log(`   News: 2`);
    console.log(`   Opportunities: 2`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
