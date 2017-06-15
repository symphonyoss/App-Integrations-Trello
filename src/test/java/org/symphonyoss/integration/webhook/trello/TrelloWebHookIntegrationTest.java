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

package org.symphonyoss.integration.webhook.trello;

import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.symphonyoss.integration.model.config.IntegrationInstance;
import org.symphonyoss.integration.model.config.IntegrationSettings;
import org.symphonyoss.integration.webhook.WebHookPayload;
import org.symphonyoss.integration.webhook.exception.WebHookParseException;
import org.symphonyoss.integration.webhook.trello.parser.AttachmentToCardTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.BoardAddedToTeamTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.BoardMemberAddedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.BoardUpdatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.CardConvertedFromCheckItemTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.CardCreatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.CheckItemCreatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.CheckItemStateUpdatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.CheckItemUpdatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.ChecklistAddedToCardTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.ListCreatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.ListMovedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.ListUpdatedTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.NullTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParserException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.ws.rs.core.MediaType;

/**
 * Test class to validate {@link TrelloWebHookIntegration}
 * Created by rsanchez on 25/08/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class TrelloWebHookIntegrationTest {

  private static final String TEST_EVENT = "testEvent";

  private static final String MOCK_TYPE = "trelloWebHookIntegration";

  @Spy
  private static List<TrelloParser> beans = new ArrayList<>();

  @InjectMocks
  private TrelloWebHookIntegration trelloWebHookIntegration = new TrelloWebHookIntegration();

  private IntegrationInstance instance = new IntegrationInstance();

  @BeforeClass
  public static void init() {
    beans.add(new AttachmentToCardTrelloParser());
    beans.add(new BoardAddedToTeamTrelloParser());
    beans.add(new BoardMemberAddedTrelloParser());
    beans.add(new BoardUpdatedTrelloParser());
    beans.add(new CardConvertedFromCheckItemTrelloParser());
    beans.add(new CardCreatedTrelloParser());
    beans.add(new CheckItemCreatedTrelloParser());
    beans.add(new CheckItemStateUpdatedTrelloParser());
    beans.add(new CheckItemUpdatedTrelloParser());
    beans.add(new ChecklistAddedToCardTrelloParser());
    beans.add(new ListCreatedTrelloParser());
    beans.add(new ListMovedTrelloParser());
    beans.add(new ListCreatedTrelloParser());
    beans.add(new ListUpdatedTrelloParser());
    beans.add(new NullTrelloParser());
    beans.add(new MockTrelloParser());
  }

  @Before
  public void setup() {
    trelloWebHookIntegration.init();
    ReflectionTestUtils.setField(trelloWebHookIntegration, "defaultTrelloParser",
        new NullTrelloParser());
  }

  @Test
  public void testUnknownEvent() throws IOException, WebHookParseException {
    String body =
        "{\"action\": {\"id\": \"57cf1e48e44a88197be45853\",\"idMemberCreator\": "
            + "\"57cf13d078a501d4f42ea69a\",\"type\": \"unknownEvent\",\"date\": "
            + "\"2016-09-06T19:51:36.132Z\"}}";

    WebHookPayload payload = new WebHookPayload(Collections.<String, String>emptyMap(), Collections.<String, String>emptyMap(), body);
    assertNull(trelloWebHookIntegration.parse(instance, payload));
  }

  @Test
  public void testNoEventPayload() throws WebHookParseException {
    String body = "{ \"random\": \"json\" }";
    WebHookPayload payload = new WebHookPayload(Collections.<String, String>emptyMap(), Collections.<String, String>emptyMap(), body);
    assertNull(trelloWebHookIntegration.parse(instance, payload));
  }

  @Test(expected = TrelloParserException.class)
  public void testFailReadingJSON() throws IOException, WebHookParseException {
    String body = "";

    WebHookPayload payload = new WebHookPayload(Collections.<String, String>emptyMap(), Collections.<String, String>emptyMap(), body);
    trelloWebHookIntegration.parse(instance, payload);
  }

  @Test
  public void testFilterNotifications() throws WebHookParseException {
    String body =
        "{\"action\": {\"id\": \"57cf1e48e44a88197be45853\",\"idMemberCreator\": "
            + "\"57cf13d078a501d4f42ea69a\",\"type\": \"" + TEST_EVENT + "\",\"date\": "
            + "\"2016-09-06T19:51:36.132Z\"}}";

    WebHookPayload payload = new WebHookPayload(Collections.<String, String>emptyMap(), Collections.<String, String>emptyMap(), body);
    assertNull(trelloWebHookIntegration.parse(instance, payload));
  }

  @Test
  public void testSupportedContentTypes() {
    List<MediaType> supportedContentTypes = new ArrayList<>();
    supportedContentTypes.add(MediaType.WILDCARD_TYPE);

    Assert.assertEquals(trelloWebHookIntegration.getSupportedContentTypes(), supportedContentTypes);
  }

  @Test
  public void testOnConfigChange() {
    TrelloParser trelloParser1 = spy(AttachmentToCardTrelloParser.class);

    beans.add(trelloParser1);
    trelloWebHookIntegration.init();

    IntegrationSettings settings = new IntegrationSettings();
    settings.setType(MOCK_TYPE);

    trelloWebHookIntegration.onConfigChange(settings);

    verify(trelloParser1, times(1)).setTrelloUser(MOCK_TYPE);
  }
}