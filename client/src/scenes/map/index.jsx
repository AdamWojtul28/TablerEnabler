import React from 'react'

const Map = () => {
  return (
    <div>
      <div style={{fontWeight: 'bold', fontSize: '32px'}}>Map page goes here</div>
      <br></br><br></br><br></br><br></br>
      <div>Ready for development my MOKOKOS</div><br></br>

      <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
        <li>Done: Need to disable top nav bar for smaller screens and vice versa bottom nav bar for bigger screens</li>
        <li>Menu item icon from top nav bar is clickable now</li>
        <li>Sidebar is created and functional with ListItems leading to their corresponding url thru substring parsing</li>
        <li style={{ marginLeft: '20px' }}>User info section at the bottom of Sidebar is NOT clickable as of now</li>
        <li>TopNavbar and Sidebar are visible only on 600px+ screen width</li>
        <li>BottomNavbar is visible only on 600px- screen width</li>
        <li>Add 6 different loading page options (NEED HELP CHOOSING BETWEEN THEM - I can modify them based on ur inputs! )</li>
      </ul>

      <br></br>
      <br></br>

      <img src="https://i.redd.it/jzugmg96wyg81.gif" alt="Mokoko GIF" />

    </div>
  )
}

export default Map