async function createPost() {
    const heading = document.getElementById('postHeading').value;
    const content = document.getElementById('postContent').value;
  
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ heading, content, image: null }), // Assuming image is optional
    });
  
    if (response.ok) {
      const newPost = await response.json();
      console.log('Post created:', newPost);
      
      // Show toast notification
      showToast('Your post has been successfully created!');
  
      // Optionally, you can clear the form fields after successful submission
      document.getElementById('postHeading').value = '';
      document.getElementById('postContent').value = '';
    } else {
      console.error('Failed to create post');
      showToast('There was an issue creating your post. Please try again.');
    }
  }
  
  // Function to show toast message
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
  
    // Hide the toast after 3 seconds
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }
  