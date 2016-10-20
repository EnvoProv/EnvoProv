package selenium.tests;


import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
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

public class ClusterTest {

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
		//mainDriver.close();
		//driver.quit();
	}


	
	@Test
	public void usecase2Success() throws Exception
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

		// Switch to envoprov channel and wait for it to load.
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

		query.add("Create a cluster for LAMP stack");
		response.add("Sure! How many VM's do you want?");

		query.add("4");
		response.add("I dont have your credentials. Can you provide them?");
		
		query.add("yes");
		response.add("Provide Username");
		
		query.add("skuber");
		response.add("Provide Password");
		
		query.add("*****");
		response.add("Environment");
		
		
		Iterator<String> queryIterator = query.iterator();
		Iterator<String> responseIterator = response.iterator();

		while(queryIterator.hasNext()){

			input = queryIterator.next();
			reply = responseIterator.next();

			messageBot = driver.findElement(By.id("message-input"));
			messageBot.sendKeys(input);
			messageBot.sendKeys(Keys.RETURN);

			driver.navigate().refresh();
			//wait.until(ExpectedConditions.titleContains("envoprov"));
			wait.until(ExpectedConditions.refreshed(ExpectedConditions.visibilityOfElementLocated(By.id("message-input"))));
			wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

			msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));

			if( msg == null)
			{
				fail("fail_null@"+reply);
			}

			System.out.println("\n\n"+msg.getText().toLowerCase()+"\n"+(reply.toLowerCase()));
			if( (msg.getText().toLowerCase()).indexOf(reply.toLowerCase()) > -1){
				continue;
			}else
			{	
				messageBot = driver.findElement(By.id("message-input"));
				messageBot.sendKeys("bye");
				messageBot.sendKeys(Keys.RETURN);

				driver.navigate().refresh();
				//wait.until(ExpectedConditions.titleContains("envoprov"));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
				wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

				msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
				fail("Fail-Unexpected-Flow");
				driver.close();
				driver.quit();
			}

		}
		
		driver.close();
		driver.quit();
		assertTrue(true);
		

	}


	//@Test
	public void usecase1Failure() throws Exception
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

		// Switch to envoprov channel and wait for it to load.
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
		response.add("I dont have your credentials. Can you provide them?");

		query.add("yeah");
		response.add("Provide Username");

		query.add("skuber");
		response.add("Provide password");

		query.add("***");
		response.add("Provide Username");

		query.add("skuber");
		response.add("Provide Password");

		query.add("*****");
		response.add("Here it is!");

		Iterator<String> queryIterator = query.iterator();
		Iterator<String> responseIterator = response.iterator();

		while(queryIterator.hasNext()){

			input = queryIterator.next();
			reply = responseIterator.next();

			messageBot = driver.findElement(By.id("message-input"));
			messageBot.sendKeys(input);
			messageBot.sendKeys(Keys.RETURN);

			driver.navigate().refresh();
			//wait.until(ExpectedConditions.titleContains("envoprov"));
			wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
			wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

			msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));

			if( msg == null)
			{
				fail("fail_null@"+reply);
			}

			//System.out.println(msg.getText().toLowerCase()+"\n"+(reply.toLowerCase()));
			if( (msg.getText().toLowerCase()).contains(reply.toLowerCase())){
				continue;
			}else
			{
				messageBot = driver.findElement(By.id("message-input"));
				messageBot.sendKeys("bye");
				messageBot.sendKeys(Keys.RETURN);

				driver.navigate().refresh();
				//wait.until(ExpectedConditions.titleContains("envoprov"));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
				wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

				msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
				fail("Fail-Unexpected-Flow");
				driver.close();
				driver.quit();

				
			}

			driver.close();
			driver.quit();
			assertTrue(true);
			
		}
	}
}






