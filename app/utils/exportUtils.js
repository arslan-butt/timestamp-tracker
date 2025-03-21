// utils/exportUtils.js

/**
 * Converts a collection of projects and tasks to CSV format
 * @param {Array} projects - Array of project objects with nested tasks
 * @param {Boolean} includeTaskDetails - Whether to include detailed task information
 * @returns {String} CSV formatted string
 */
export function projectsToCSV(projects, includeTaskDetails = true) {
  if (!projects || !projects.length) {
    return '';
  }

  if (!includeTaskDetails) {
    // Simple project summary without tasks
    const headers = ['ID', 'Project Name', 'Status', 'Total Duration', 'Date'];
    const rows = projects.map((project) => [
      project.id,
      `"${project.name}"`,
      project.status,
      project.duration || '00:00:00',
      project.date,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  } else {
    // Detailed export with flattened project+task structure
    const headers = [
      'Project ID',
      'Project Name',
      'Project Status',
      'Project Duration',
      'Project Date',
      'Task ID',
      'Task Title',
      'Task Duration',
      'Task Status',
      'Task Type',
    ];

    const rows = [];
    projects.forEach((project) => {
      const tasks = project.tasks || [];
      if (tasks.length === 0) {
        // Project with no tasks
        rows.push([
          project.id,
          `"${project.name}"`,
          project.status,
          project.duration || '00:00:00',
          project.date,
          '',
          '',
          '',
          '',
          '',
        ]);
      } else {
        // Add a row for each task
        tasks.forEach((task) => {
          rows.push([
            project.id,
            `"${project.name}"`,
            project.status,
            project.duration || '00:00:00',
            project.date,
            task.id || '',
            `"${task.title}"`,
            task.duration || '',
            task.status || '',
            task.type || '',
          ]);
        });
      }
    });

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
}

/**
 * Converts projects and tasks to formatted JSON
 * @param {Array} projects - Array of project objects with nested tasks
 * @param {Boolean} includeTaskDetails - Whether to include detailed task information
 * @returns {String} Formatted JSON string
 */
export function projectsToJSON(projects, includeTaskDetails = true) {
  if (!includeTaskDetails) {
    // Simple project summary
    const simplified = projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      duration: project.duration || '00:00:00',
      date: project.date,
    }));

    return JSON.stringify(simplified, null, 2);
  } else {
    // Keep full structure with tasks
    return JSON.stringify(projects, null, 2);
  }
}

/**
 * Generate email content for sharing
 * @param {Array} projects - Array of project objects
 * @param {Object} filters - Current filter settings
 * @param {String} message - Optional user message
 * @returns {String} Formatted email content
 */
export function generateEmailContent(projects, filters, message = '') {
  // Calculate some statistics
  const totalProjects = projects.length;
  const totalDuration = projects.reduce((acc, project) => {
    // Convert duration to seconds and add to accumulator
    const [h, m, s] = (project.duration || '0:0:0').split(':').map(Number);
    return acc + (h * 3600 + m * 60 + s);
  }, 0);

  // Format the total duration back to HH:MM:SS
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const seconds = totalDuration % 60;
  const formattedTotalDuration = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Create email content
  let content = `
Project Report (${new Date().toLocaleDateString()})
------------------------------------------------------

Filtered by:
- Status: ${filters.state === 'all' ? 'All' : filters.state}
- Task Type: ${filters.taskType === 'all' ? 'All' : filters.taskType}
- Duration: ${
    filters.duration === 'all' ? 'All' : `Up to ${filters.duration} hours`
  }

Summary:
- Total Projects: ${totalProjects}
- Total Duration: ${formattedTotalDuration}
`;

  if (message) {
    content += `\nMessage:\n${message}\n`;
  }

  content += `\nProjects:\n`;

  // Add project details
  projects.forEach((project, index) => {
    content += `\n${index + 1}. ${project.name} (${project.status})`;
    content += `\n   Duration: ${project.duration || '00:00:00'}`;
    content += `\n   Date: ${project.date}`;

    // Add task details if available
    if (project.tasks && project.tasks.length > 0) {
      content += `\n   Tasks:`;
      project.tasks.forEach((task, taskIndex) => {
        content += `\n     ${taskIndex + 1}. ${task.title} (${task.status}) - ${
          task.duration
        }`;
      });
    }
  });

  return content;
}

/**
 * Generates a filename with date stamp for exports
 * @param {String} prefix - Prefix for the filename
 * @param {String} extension - File extension (without dot)
 * @returns {String} Formatted filename
 */
export function generateExportFilename(
  prefix = 'project_export',
  extension = 'csv'
) {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.${extension}`;
}
