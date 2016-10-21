package selenium.tests;

import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.FileReader;
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

public class DeleteVMTest {

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
			
			System.out.println("HI" +username);
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
	public void usecase3Success() throws Exception
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

		query.add("delete instance");
		response.add("Could you provide the ID of the VM to be deleted?");

		query.add("CL001");
		response.add("Sure! I have your Amazon EC2 credentials.Should I use them to delete this VM?");

		query.add("yes");
		response.add("Are you sure you want to delete?");
		
		query.add("yes");
		response.add("Done! The cluster has been deleted");
		
		Iterator<String> queryIterator = query.iterator();
		Iterator<String> responseIterator = response.iterator();

		while(queryIterator.hasNext()){

			input = queryIterator.next();
			reply = responseIterator.next();
			
			System.out.println("Input:" +input);
			System.out.println("Reply:" +reply);

			messageBot = driver.findElement(By.id("message-input"));
			messageBot.sendKeys(input);
			messageBot.sendKeys(Keys.RETURN);

			driver.navigate().refresh();
			wait.until(ExpectedConditions.titleContains("envoprov"));
			wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
			driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
			wait.withTimeout(15,TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
			
			Thread.sleep(5000);
			msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));

			if( msg == null)
			{
				fail("fail_null@"+reply);
			}

			System.out.println(msg.getText().toLowerCase()+"\n"+(reply.toLowerCase()));
			if( (msg.getText().toLowerCase()).contains(reply.toLowerCase())){
				continue;
			}else
			{	
				messageBot = driver.findElement(By.id("message-input"));
				messageBot.sendKeys("bye");
				messageBot.sendKeys(Keys.RETURN);

				driver.navigate().refresh();
				wait.until(ExpectedConditions.titleContains("envoprov"));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
				driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
				wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

				msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
				fail("Fail-Unexpected-Flow");
				driver.close();
				driver.quit();
			}
			
			System.out.println("------HI-------");

		}
		
		driver.close();
		driver.quit();

	}
	
	
	@Test
	public void usecase3Failure() throws Exception
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

		query.add("delete instance");
		response.add("Could you provide the ID of the VM to be deleted?");

		query.add("CL002");
		response.add("Sure! I have your Amazon EC2 credentials.Should I use them to delete this VM?");

		query.add("yes");
		response.add("Sorry the VM ID selected does not exists or you do not have access rights to it");

		Iterator<String> queryIterator = query.iterator();
		Iterator<String> responseIterator = response.iterator();

		while(queryIterator.hasNext()){

			input = queryIterator.next();
			reply = responseIterator.next();
			
			System.out.println("Input:" + input);
			System.out.println("Reply:" + reply);
			
			messageBot = driver.findElement(By.id("message-input"));
			messageBot.sendKeys(input);
			messageBot.sendKeys(Keys.RETURN);

			driver.navigate().refresh();
			wait.until(ExpectedConditions.titleContains("envoprov"));
			wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
			driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
			wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
			
			Thread.sleep(5000);
			msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));

			if( msg == null)
			{
				fail("fail_null@"+reply);
			}

			System.out.println(msg.getText().toLowerCase()+"\n"+(reply.toLowerCase()));
			if( (msg.getText().toLowerCase()).contains(reply.toLowerCase())){
				continue;
			}else
			{
				messageBot = driver.findElement(By.id("message-input"));
				messageBot.sendKeys("bye");
				messageBot.sendKeys(Keys.RETURN);

				driver.navigate().refresh();
				wait.until(ExpectedConditions.titleContains("envoprov"));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.presenceOfElementLocated(By.id("message-input"))));
				driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
				wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

				msg = driver.findElement(By.xpath("(//span[@class='message_body'])[last()]"));
				fail("Fail-Unexpected-Flow");
				driver.close();
				driver.quit();
		
			}

			driver.close();
			driver.quit();
			
		}
	}

}
