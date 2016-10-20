package selenium.tests;


import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;

import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;
import java.io.*;

public class SlackSelenium {

	private WebDriver mainDriver;
	private static String username;
	private static String password;

	//@BeforeClass
	public WebDriver setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		mainDriver = new ChromeDriver();

		try {

			FileReader fileReader = new FileReader("credentials.txt");
			BufferedReader bufferedReader = new BufferedReader(fileReader);

			username = bufferedReader.readLine();
			password = bufferedReader.readLine();

			bufferedReader.close();         
		}
		catch(Exception ex){
			ex.printStackTrace();
		}

		return mainDriver;
	}

	@AfterClass
	public static void tearDown() throws Exception {
		//driver.close();
		//driver.quit();
	}


	//Selenium Base Test
	//@Test
	public void botPing() throws Exception
	{
		WebDriver driver = this.setUp();
		driver.get("https://csc510-project-group.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys(username);
		pw.sendKeys(password);


		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));


		// Switch to #general channel and wait for it to load.
		driver.get("https://csc510-project-group.slack.com/messages/@envoprov");
		wait.until(ExpectedConditions.titleContains("envoprov"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("Hi");
		messageBot.sendKeys(Keys.RETURN);

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		WebElement msg = driver.findElement(
				By.xpath("(//span[@class='message_body'])[last()]"));
		assertNotNull(msg);
	}

	@Test
	public void usecase1Success() throws Exception
	{
		WebDriver driver = this.setUp();
		driver.get("https://csc510-project-group.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys(username);
		pw.sendKeys(password);


		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #general channel and wait for it to load.
		driver.get("https://csc510-project-group.slack.com/messages/@envoprov");
		wait.until(ExpectedConditions.titleContains("envoprov"));

		
		WebElement messageBot = driver.findElement(By.id("message-input"));
		WebElement msg = null;
		
		String reply = "";
		String input = "";
		
		ArrayList<String> query = new ArrayList<String>();
		ArrayList<String> response = new ArrayList<String>();
		
		query.add("Hi");
		response.add("Hi");
		
		query.add("Create a single VM for LAMP stack");
		response.add("Sure! I have your Amazon EC2 credentials. Should I use them to deply this VM?");
		
		query.add("yes");
		response.add("Here it is!");
		
		Iterator<String> queryIterator = query.iterator();
		Iterator<String> responseIterator = response.iterator();
		
		while(queryIterator.hasNext()){

			input = queryIterator.next();
			reply = responseIterator.next();
			
			messageBot.sendKeys(input);
			messageBot.sendKeys(Keys.RETURN);
			
			driver.navigate().refresh();
			wait.until(ExpectedConditions.titleContains("envoprov"));
			wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

			msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
			 
			if( msg == null)
			{
				fail("fail@"+reply);
			}
			
			if( msg.getText().contains(reply)){
				continue;
			}else
			{
				fail("fail@"+reply);
			}

			
		}
		
		assertTrue(true);
		
	/*	
		// Type something
		
		
		messageBot.sendKeys(input);
		messageBot.sendKeys(Keys.RETURN);
		driver.navigate().refresh();
		wait.until(ExpectedConditions.titleContains("envoprov"));
		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
		if(msg == null)
		{
			fail("fail@Hello!!");
		}
		
		messageBot = driver.findElement(By.id("message-input"));		
		messageBot.sendKeys("Create a single VM for LAMP stack");
		messageBot.sendKeys(Keys.RETURN);

		driver.navigate().refresh();
		wait.until(ExpectedConditions.titleContains("envoprov"));
		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
		reply = msg.getText();
		System.out.println(reply.equals("Sure! I have your Amazon EC2 credentials. Should I use them to deply this VM?"));
		messageBot = driver.findElement(By.id("message-input"));
		if(reply.equals("I dont have your credentials. Can you provide them?"))
		{	messageBot.sendKeys("username ssdharma password *********");
		messageBot.sendKeys(Keys.RETURN);
		}else
		{
			fail("Failed@'I dont have your credentials. Can you provide them?'");
		}

		driver.navigate().refresh();
		wait.until(ExpectedConditions.titleContains("envoprov"));
		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
		reply = msg.getText();
		System.out.println(reply);;		

		if(reply.equals("Thank you! Should I deploy on AWS?"))
		{	messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("yes");
		messageBot.sendKeys(Keys.RETURN);
		}else
		{
			fail("Failed@'Thank you! Should I deploy on AWS?'");
		}

		driver.navigate().refresh();
		wait.until(ExpectedConditions.titleContains("envoprov"));
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
		reply = msg.getText();
	*/
		
	}


}
