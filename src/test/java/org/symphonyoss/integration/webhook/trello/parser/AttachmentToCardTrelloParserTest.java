/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello.parser;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;
import org.symphonyoss.integration.entity.model.User;
import org.symphonyoss.integration.model.config.IntegrationInstance;

import java.io.IOException;

/**
 * Test class to validate {@link AttachmentToCardTrelloParser}
 * Created by rsanchez on 12/09/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class AttachmentToCardTrelloParserTest extends CommonTrelloTest {

  @InjectMocks
  private AttachmentToCardTrelloParser parser = new AttachmentToCardTrelloParser();

  private IntegrationInstance instance = new IntegrationInstance();


  @Before
  public void setup() {
    String optionalProperties = "{ \"notifications\": [\"attachmentAddedToCard\"] }";
    instance.setOptionalProperties(optionalProperties);
  }

  @Test
  public void testAddAttachmentToCardLocalFile() throws TrelloParserException, IOException {
    JsonNode rootNode = getJsonFile("payload_trello_attachment_local.json");

    String result = parser.parse(instance, rootNode);
    assertNotNull(result);

    String expected = readFile("payload_trello_attachment_local_expected_message.xml");
    assertEquals(expected, result);
  }

  @Test
  public void testAddAttachmentToDropbox() throws TrelloParserException, IOException {
    JsonNode rootNode = getJsonFile("payload_trello_attachment_dropbox.json");

    User user = new User();
    user.setId(699722783L);
    user.setUserName("ecarrenhosymphonytest");
    user.setEmailAddress("ecarrenhosymphonytest@symphony.com");
    user.setDisplayName("Evandro Carrenho");
    when(userService.getUserByUserName(anyString(), anyString())).thenReturn(user);

    String result = parser.parse(instance, rootNode);
    assertNotNull(result);

    String expected = readFile("payload_trello_attachment_dropbox_expected_message.xml");
    assertEquals(expected, result);
  }

  @Test
  public void testIgnoreNotification() throws IOException {
    String optionalProperties = "{ \"notifications\": [\"listCreated\"] }";
    instance.setOptionalProperties(optionalProperties);

    JsonNode rootNode = getJsonFile("payload_trello_attachment_local.json");
    assertFalse(parser.filterNotifications(instance, rootNode));
  }

}
