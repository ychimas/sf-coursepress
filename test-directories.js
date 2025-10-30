const { mkdir, writeFile } = require('fs/promises');
const { join } = require('path');

async function testDirectories() {
  try {
    console.log('Testing directory creation...');
    console.log('Current working directory:', process.cwd());
    
    // Test creating cursos directory
    const cursosDir = join(process.cwd(), 'cursos');
    console.log('Creating cursos directory at:', cursosDir);
    await mkdir(cursosDir, { recursive: true });
    console.log('✓ Cursos directory created successfully');
    
    // Test creating a test course
    const testCourseDir = join(cursosDir, 'test-course');
    console.log('Creating test course directory at:', testCourseDir);
    await mkdir(testCourseDir, { recursive: true });
    console.log('✓ Test course directory created successfully');
    
    // Test creating subdirectories
    const cssDir = join(testCourseDir, 'css');
    const jsDir = join(testCourseDir, 'js');
    const leccionesDir = join(testCourseDir, 'lecciones');
    
    await mkdir(cssDir, { recursive: true });
    await mkdir(jsDir, { recursive: true });
    await mkdir(leccionesDir, { recursive: true });
    console.log('✓ Subdirectories created successfully');
    
    // Test writing a file
    const testFile = join(testCourseDir, 'test.txt');
    await writeFile(testFile, 'Test file content', 'utf-8');
    console.log('✓ Test file written successfully');
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Error during testing:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testDirectories();